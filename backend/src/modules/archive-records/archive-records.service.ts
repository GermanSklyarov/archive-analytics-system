import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { User } from '../users/entities/user.entity';
import {
  CreateArchiveRecordDto,
  QueryArchiveRecordsDto,
  UpdateArchiveRecordDto,
} from './dto';
import { ArchiveRecord } from './entities/archive-record.entity';
import {
  parseDate,
  parseMetadata,
  parseNumber,
  parseString,
} from './import/parsers';
import {
  ParsedRecord,
  PreviewRecord,
  PreviewRow,
  RawRow,
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

  async importFromFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json<RawRow>(sheet);

    if (!rawData.length) {
      throw new BadRequestException('Empty file');
    }

    const parsedRecords: ParsedRecord[] = [];
    const errors: string[] = [];

    rawData.forEach((row, index) => {
      try {
        const { category, value, userId, created_at, ...rest } = row;

        if (!category || value === undefined) {
          throw new Error('category and value are required');
        }

        parsedRecords.push({
          category: parseString(category, 'category', index),
          value: parseNumber(value, index),
          userId:
            userId !== undefined && userId !== null
              ? Number(userId)
              : undefined,
          created_at: parseDate(created_at),
          metadata: parseMetadata(rest, index),
        });
      } catch (e: unknown) {
        errors.push(`Row ${index}: ${getErrorMessage(e)}`);
      }
    });

    const userIds = Array.from(
      new Set(
        parsedRecords
          .map((r) => r.userId)
          .filter((id): id is number => typeof id === 'number'),
      ),
    );

    let existingUserIds = new Set<number>();

    if (userIds.length) {
      const existingUsers = await this.archiveRepo.manager
        .getRepository(User)
        .findBy({ id: In(userIds) });

      existingUserIds = new Set(existingUsers.map((u) => u.id));
    }

    const validRecords: ParsedRecord[] = [];

    parsedRecords.forEach((record, index) => {
      if (record.userId && !existingUserIds.has(record.userId)) {
        errors.push(`Row ${index}: user ${record.userId} not found`);
        return;
      }

      validRecords.push(record);
    });

    const uniqueMap = new Map<string, ParsedRecord>();

    for (const record of validRecords) {
      const key = JSON.stringify({
        category: record.category,
        value: record.value,
        created_at: record.created_at.toISOString(),
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
            category: r.category,
            value: r.value,
            created_at: r.created_at,
            metadata: r.metadata,
            user: r.userId ? { id: r.userId } : undefined,
          })),
        )
        .orIgnore()
        .execute();

      inserted += result.identifiers.length;
    }

    return {
      total: rawData.length,
      parsed: parsedRecords.length,
      valid: validRecords.length,
      inserted,
      skipped: rawData.length - inserted,
      invalid: errors.length,
      errors: errors.slice(0, 20),
    };
  }

  async previewImport(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json<RawRow>(sheet);

    const preview: PreviewRow[] = [];
    const errors: string[] = [];

    const userIds = Array.from(
      new Set(
        rawData
          .map((row) => row.userId)
          .filter((id): id is number => typeof id === 'number'),
      ),
    );

    const existingUsers = await this.archiveRepo.manager
      .getRepository(User)
      .findBy({ id: In(userIds) });

    const existingUserIds = new Set(existingUsers.map((u) => u.id));

    rawData.forEach((row, index) => {
      const rowErrors: string[] = [];

      try {
        const { category, value, userId, created_at, ...rest } = row;

        const parsedUserId = userId !== undefined ? Number(userId) : undefined;

        if (parsedUserId && !existingUserIds.has(parsedUserId)) {
          rowErrors.push(`User ${parsedUserId} not found`);
        }

        const parsed: Partial<PreviewRecord> = {
          category: parseString(category, 'category', index),
          value: parseNumber(value, index),
          userId: parsedUserId,
          created_at: parseDate(created_at),
          metadata: parseMetadata(rest, index),
        };

        preview.push({
          index,
          data: parsed,
          isValid: rowErrors.length === 0,
          errors: rowErrors,
        });

        if (rowErrors.length) {
          errors.push(`Row ${index}: ${rowErrors.join(', ')}`);
        }
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
      valid: preview.filter((r) => r.isValid).length,
      invalid: preview.filter((r) => !r.isValid).length,
      errors: errors.slice(0, 20),
      preview: preview.slice(0, 50),
    };
  }

  async findAll(query: QueryArchiveRecordsDto) {
    const qb = this.archiveRepo
      .createQueryBuilder('record')
      .leftJoinAndSelect('record.user', 'user');

    if (query.category) {
      qb.andWhere('record.category = :category', {
        category: query.category,
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
