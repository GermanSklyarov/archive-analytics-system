import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateArchiveRecordDto,
  QueryArchiveRecordsDto,
  UpdateArchiveRecordDto,
} from './dto';
import { ArchiveRecord } from './entities/archive-record.entity';
import * as XLSX from 'xlsx';

type ImportRow = {
  category: string;
  value: number | string;
  userId?: number;
  created_at?: string | Date;
};

function parseDate(input: string | number | Date | undefined): Date {
  if (!input) return new Date();

  if (typeof input === 'number') {
    return new Date((input - 25569) * 86400 * 1000);
  }

  if (input instanceof Date) {
    return input;
  }

  const date = new Date(input);
  return isNaN(date.getTime()) ? new Date() : date;
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

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rawData = XLSX.utils.sheet_to_json(sheet);

    if (!rawData.length) {
      throw new BadRequestException('Empty file');
    }

    const records = (rawData as ImportRow[]).map((row, index) => {
      if (!row.category || row.value === undefined) {
        throw new BadRequestException(
          `Invalid row at index ${index}: category and value are required`,
        );
      }

      const value = Number(row.value);

      if (isNaN(value)) {
        throw new BadRequestException(
          `Invalid value at row ${index}: "${row.value}" is not a number`,
        );
      }

      return {
        category: row.category,
        value,
        user: row.userId ? { id: row.userId } : undefined,
        created_at: parseDate(row.created_at),
      };
    });

    const uniqueMap = new Map<string, (typeof records)[0]>();

    for (const record of records) {
      const key = `${record.category}_${record.value}_${record.created_at.toISOString()}_${record.user?.id ?? 'null'}`;

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
        .values(chunk)
        .orIgnore()
        .execute();

      inserted += result.identifiers.length;
    }

    return {
      total: records.length,
      unique: uniqueRecords.length,
      inserted,
      skipped: uniqueRecords.length - inserted,
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
}
