import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateArchiveRecordDto,
  QueryArchiveRecordsDto,
  UpdateArchiveRecordDto,
} from './dto';
import { ArchiveRecord } from './entities/archive-record.entity';
import {
  normalizeSingleRecord,
  normalizeWideRecords,
  resolveWideModeColumns,
} from './import/transform';
import { readWorksheetRows } from './import/worksheet';
import {
  ColumnMapping,
  NormalizedRecord,
  PreviewImportResponse,
  PreviewRow,
  RawRow,
  TagRow,
  UnitRow,
} from './import/types';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

@Injectable()
export class ArchiveRecordsService {
  constructor(
    @InjectRepository(ArchiveRecord)
    private readonly archiveRepo: Repository<ArchiveRecord>,
  ) {}
  async create(dto: CreateArchiveRecordDto) {
    const record = this.archiveRepo.create({
      ...dto,
      user: dto.userId ? { id: dto.userId } : undefined,
    });

    return this.archiveRepo.save(record);
  }

  async importFromFile(
    file: Express.Multer.File,
    mapping: ColumnMapping,
    currentUserId: number,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const rawData = readWorksheetRows(file);

    if (!rawData.length) {
      throw new BadRequestException('Empty file');
    }

    const wideMode = resolveWideModeColumns(rawData, mapping);

    if (wideMode.enabled && wideMode.valueColumns.length === 0) {
      throw new BadRequestException(
        'No numeric columns found for automatic wide import',
      );
    }

    const parsedRecords: NormalizedRecord[] = [];
    const errors: string[] = [];

    rawData.forEach((row, index) => {
      try {
        const records = wideMode.enabled
          ? normalizeWideRecords(
              row,
              index,
              mapping,
              currentUserId,
              wideMode.valueColumns,
            )
          : [normalizeSingleRecord(row, index, mapping, currentUserId)];

        parsedRecords.push(...records);
      } catch (e: unknown) {
        errors.push(`Row ${index}: ${getErrorMessage(e)}`);
      }
    });

    const validRecords = parsedRecords;

    const uniqueMap = new Map<string, NormalizedRecord>();

    for (const record of validRecords) {
      const key = JSON.stringify({
        tag: record.tag,
        category: record.category,
        value: record.value,
        created_at: record.created_at.toISOString(),
        unit: record.unit,
        userId: record.userId ?? null,
        metadata: record.metadata ?? null,
      });

      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, record);
      }
    }

    const uniqueRecords = Array.from(uniqueMap.values());

    const chunkSize = 500;
    let inserted = 0;

    for (let i = 0; i < uniqueRecords.length; i += chunkSize) {
      const chunk = uniqueRecords.slice(i, i + chunkSize);

      const result = await this.archiveRepo
        .createQueryBuilder()
        .insert()
        .values(
          chunk.map((r) => ({
            tag: r.tag,
            category: r.category,
            value: r.value,
            created_at: r.created_at,
            unit: r.unit,
            metadata: r.metadata as Record<string, any>,
            user: { id: currentUserId },
          })),
        )
        .orIgnore()
        .execute();

      inserted += result.identifiers.length;
    }

    return {
      total: rawData.length,
      generated: parsedRecords.length,
      mode: wideMode.enabled ? 'wide' : 'single',
      parsed: parsedRecords.length,
      valid: validRecords.length,
      inserted,
      skipped: validRecords.length - inserted,
      invalid: errors.length,
      errors: errors.slice(0, 20),
    };
  }

  previewImport(file: Express.Multer.File): PreviewImportResponse {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const rawData = readWorksheetRows(file);

    if (!rawData.length) {
      throw new BadRequestException('Empty file');
    }

    const columns = Object.keys(rawData[0] ?? {});
    const mapping = this.autoDetectMapping(columns, rawData);
    const wideMode = resolveWideModeColumns(rawData, mapping);
    const generated = wideMode.enabled
      ? rawData.reduce(
          (count, row) =>
            count +
            wideMode.valueColumns.filter(
              (column) => row[column] !== null && row[column] !== '',
            ).length,
          0,
        )
      : rawData.length;

    return {
      total: rawData.length,
      generated,
      mode: wideMode.enabled ? 'wide' : 'single',
      preview: rawData.slice(0, 50).map((row, index) => ({
        index,
        raw: row,
        isValid: true,
        errors: [],
      })),
      columns,
      mapping,
    };
  }

  previewWithMapping(file: Express.Multer.File, mapping: ColumnMapping) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const rawData = readWorksheetRows(file);
    const wideMode = resolveWideModeColumns(rawData, mapping);

    if (wideMode.enabled && wideMode.valueColumns.length === 0) {
      throw new BadRequestException(
        'No numeric columns found for automatic wide preview',
      );
    }

    const preview: PreviewRow[] = [];
    const errors: string[] = [];

    rawData.forEach((row, index) => {
      try {
        const records = wideMode.enabled
          ? normalizeWideRecords(row, index, mapping, 1, wideMode.valueColumns)
          : [normalizeSingleRecord(row, index, mapping, 1)];

        if (records.length === 0) {
          errors.push(`Row ${index}: no numeric values found`);
          preview.push({
            index,
            data: {},
            isValid: false,
            errors: ['no numeric values found'],
          });
          return;
        }

        records.forEach((record, recordIndex) => {
          preview.push({
            index: wideMode.enabled ? index * 1000 + recordIndex : index,
            data: record,
            isValid: true,
            errors: [],
          });
        });
      } catch (e: unknown) {
        const message = getErrorMessage(e);

        preview.push({
          index,
          data: {},
          isValid: false,
          errors: [message],
        });

        errors.push(`Row ${index}: ${message}`);
      }
    });

    return {
      total: rawData.length,
      generated: preview.length,
      mode: wideMode.enabled ? 'wide' : 'single',
      valid: preview.filter((r) => r.isValid).length,
      invalid: preview.filter((r) => !r.isValid).length,
      errors: errors.slice(0, 20),
      preview: preview.slice(0, 50),
    };
  }

  private autoDetectMapping(
    columns: string[],
    sampleRows: RawRow[] = [],
  ): ColumnMapping {
    const normalize = (str: string) => str.toLowerCase();

    const find = (candidates: string[]) =>
      columns.find((col) => candidates.some((c) => normalize(col).includes(c)));

    const findDedicatedUnitColumn = () =>
      columns.find((col) => {
        const normalized = normalize(col);

        return (
          normalized === 'unit' ||
          normalized.includes('unit ') ||
          normalized.includes(' unit') ||
          normalized.includes('единиц') ||
          normalized.includes('ед. изм') ||
          normalized.includes('ед изм') ||
          normalized.includes('measure') ||
          normalized.includes('currency')
        );
      });

    const findCategoryColumn = () =>
      find(['category', 'group', 'name', 'категор', 'группа']) ||
      columns.find((col) => normalize(col).includes('сменное время'));

    const findDateColumn = () =>
      columns.find((col) => normalize(col).includes('дата листа')) ||
      find(['date', 'created', 'дата']) ||
      columns.find((col) => normalize(col) === 'дата');

    const findUnitColumnFromSamples = () =>
      columns.find((col) => {
        const values = sampleRows
          .slice(0, 20)
          .map((row) => row[col])
          .filter(
            (value): value is string =>
              typeof value === 'string' && value.trim() !== '',
          );

        if (values.length < 3) {
          return false;
        }

        const allowed = values.filter((value) =>
          ['мин', 'ч', '%', 'кг', 'гр', 'тонн', 'т/час', 'г/т'].includes(
            value.trim().toLowerCase(),
          ),
        );

        return allowed.length >= Math.ceil(values.length * 0.6);
      });

    return {
      value: find(['value', 'amount', 'price', 'sum', 'значение']) || '',
      category: findCategoryColumn() || '',
      created_at: findDateColumn() || '',
      tag: find(['tag', 'source', 'тег', 'источник']) || '',
      unit: findDedicatedUnitColumn() || findUnitColumnFromSamples() || '',
    };
  }

  async getMeta(userId?: number) {
    const categoriesQb = this.archiveRepo.createQueryBuilder('record');

    if (userId) {
      categoriesQb.where('record.userId = :userId', { userId });
    }

    const categoriesRaw = await categoriesQb
      .select('record.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .andWhere('record.category IS NOT NULL')
      .groupBy('record.category')
      .orderBy('count', 'DESC')
      .limit(100)
      .getRawMany<{ category: string; count: string }>();

    const tagsQb = this.archiveRepo.createQueryBuilder('record');

    if (userId) {
      tagsQb.where('record.userId = :userId', { userId });
    }

    const tagsRaw = await tagsQb
      .select('LOWER(TRIM(record.tag))', 'tag')
      .addSelect('COUNT(*)', 'count')
      .andWhere('record.tag IS NOT NULL')
      .groupBy('tag')
      .orderBy('count', 'DESC')
      .limit(50)
      .getRawMany<TagRow>();

    const unitsQb = this.archiveRepo.createQueryBuilder('record');

    if (userId) {
      unitsQb.where('record.userId = :userId', { userId });
    }

    const unitsRaw = await unitsQb
      .select('LOWER(TRIM(record.unit))', 'unit')
      .addSelect('COUNT(*)', 'count')
      .andWhere('record.unit IS NOT NULL')
      .groupBy('unit')
      .orderBy('count', 'DESC')
      .limit(50)
      .getRawMany<UnitRow>();

    return {
      categories: categoriesRaw.map((category) => ({
        value: category.category,
        count: Number(category.count),
      })),
      tags: tagsRaw.map((t) => ({
        value: t.tag,
        count: Number(t.count),
      })),
      units: unitsRaw.map((u) => ({
        value: u.unit,
        count: Number(u.count),
      })),
    };
  }

  async findAll(query: QueryArchiveRecordsDto) {
    const qb = this.archiveRepo
      .createQueryBuilder('record')
      .leftJoinAndSelect('record.user', 'user');

    if (query.category) {
      qb.andWhere('record.category ILIKE :category', {
        category: `%${query.category}%`,
      });
    }

    if (query.userId) {
      qb.andWhere('user.id = :userId', {
        userId: query.userId,
      });
    }

    if (query.minValue) {
      qb.andWhere('record.value >= :minValue', {
        minValue: query.minValue,
      });
    }

    if (query.maxValue) {
      qb.andWhere('record.value <= :maxValue', {
        maxValue: query.maxValue,
      });
    }

    if (query.dateFrom) {
      qb.andWhere('record.created_at >= :dateFrom', {
        dateFrom: query.dateFrom,
      });
    }

    if (query.dateTo) {
      qb.andWhere('record.created_at <= :dateTo', {
        dateTo: query.dateTo,
      });
    }

    if (query.tag) {
      qb.andWhere('LOWER(TRIM(record.tag)) = LOWER(TRIM(:tag))', {
        tag: query.tag,
      });
    }

    if (query.unit) {
      qb.andWhere('LOWER(TRIM(record.unit)) = LOWER(TRIM(:unit))', {
        unit: query.unit,
      });
    }

    const allowedSortFields = ['created_at', 'value', 'category'];

    const sortBy = allowedSortFields.includes(query.sortBy ?? '')
      ? query.sortBy
      : 'created_at';

    const order = query.order || 'DESC';

    qb.orderBy(`record.${sortBy}`, order);

    const limit = query.limit || 10;
    const page = query.page || 1;

    qb.take(limit).skip((page - 1) * limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number) {
    return this.archiveRepo.findOneOrFail({
      where: { id },
      relations: ['user'],
    });
  }

  async update(id: number, dto: UpdateArchiveRecordDto) {
    await this.archiveRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.archiveRepo.delete(id);
    return { deleted: true };
  }

  async removeMany(ids: number[]) {
    await this.archiveRepo.delete(ids);
    return { ids };
  }
}
