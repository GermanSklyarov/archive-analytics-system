import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArchiveRecord } from '../archive-records/entities/archive-record.entity';
import { ResultsService } from '../results/results.service';
import { CreateAnalyticsDto } from './dto';
import { AnalyticsRequest } from './entities/analytics.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(ArchiveRecord)
    private readonly archiveRepo: Repository<ArchiveRecord>,
    private readonly resultsService: ResultsService,

    @InjectRepository(AnalyticsRequest)
    private readonly analyticsRepo: Repository<AnalyticsRequest>,
  ) {}

  async getAverage(dateFrom?: string, dateTo?: string) {
    const qb = this.archiveRepo.createQueryBuilder('record');

    if (dateFrom) {
      qb.andWhere('record.created_at >= :dateFrom', { dateFrom });
    }

    if (dateTo) {
      qb.andWhere('record.created_at <= :dateTo', { dateTo });
    }

    const result = await qb
      .select('AVG(record.value)', 'avg')
      .getRawOne<{ avg: string | null }>();

    return {
      average: result?.avg ? Number(result.avg) : 0,
    };
  }

  async getByCategory(userId?: number, dateFrom?: string, dateTo?: string) {
    const request = await this.logRequest({
      aggregationType: 'by-category',
      userId,
      dateFrom,
      dateTo,
    });

    const qb = this.archiveRepo.createQueryBuilder('record');

    if (userId) {
      qb.andWhere('record.user_id = :userId', { userId });
    }

    if (dateFrom) {
      qb.andWhere('record.created_at >= :dateFrom', { dateFrom });
    }

    if (dateTo) {
      qb.andWhere('record.created_at <= :dateTo', { dateTo });
    }

    const result = await qb
      .select('record.category', 'category')
      .addSelect('AVG(record.value)', 'avg')
      .addSelect('COUNT(*)', 'count')
      .groupBy('record.category')
      .getRawMany<{
        category: string;
        avg: string | null;
        count: string;
      }>();

    const response = result.map((item) => ({
      category: item.category,
      avg: item.avg ? Number(item.avg) : 0,
      count: Number(item.count),
    }));

    await this.resultsService.saveResult(request, response);

    return response;
  }

  async getByDate(dateFrom?: string, dateTo?: string, userId?: number) {
    const qb = this.archiveRepo.createQueryBuilder('record');

    if (dateFrom) {
      qb.andWhere('record.created_at >= :dateFrom', { dateFrom });
    }

    if (dateTo) {
      qb.andWhere('record.created_at <= :dateTo', { dateTo });
    }

    if (userId) {
      qb.andWhere('record.user_id = :userId', { userId });
    }

    const result = await qb
      .select('DATE(record.created_at)', 'date')
      .addSelect('AVG(record.value)', 'avg')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(record.value)', 'sum')
      .addSelect('MIN(record.value)', 'min')
      .addSelect('MAX(record.value)', 'max')
      .groupBy('DATE(record.created_at)')
      .orderBy('date', 'ASC')
      .getRawMany<{
        date: string;
        avg: string | null;
        count: string;
        sum: string | null;
        min: string | null;
        max: string | null;
      }>();

    const request = await this.logRequest({
      dateFrom,
      dateTo,
      aggregationType: 'by-date',
      userId,
    });

    const response = result.map((item) => ({
      date: item.date,
      avg: item.avg ? Number(item.avg) : 0,
      count: Number(item.count),
      sum: item.sum ? Number(item.sum) : 0,
      min: item.min ? Number(item.min) : 0,
      max: item.max ? Number(item.max) : 0,
    }));

    await this.resultsService.saveResult(request, response);

    return response;
  }

  async getSummary(dateFrom?: string, dateTo?: string, userId?: number) {
    const qb = this.archiveRepo.createQueryBuilder('record');

    if (dateFrom) {
      qb.andWhere('record.created_at >= :dateFrom', { dateFrom });
    }

    if (dateTo) {
      qb.andWhere('record.created_at <= :dateTo', { dateTo });
    }

    if (userId) {
      qb.andWhere('record.user_id = :userId', { userId });
    }

    const result = await qb
      .select('AVG(record.value)', 'avg')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(record.value)', 'sum')
      .addSelect('MIN(record.value)', 'min')
      .addSelect('MAX(record.value)', 'max')
      .getRawOne<{
        avg: string | null;
        count: string;
        sum: string | null;
        min: string | null;
        max: string | null;
      }>();

    const request = await this.logRequest({
      dateFrom,
      dateTo,
      aggregationType: 'summary',
      userId,
    });

    const response = {
      avg: result?.avg ? Number(result.avg) : 0,
      count: Number(result?.count ?? 0),
      sum: result?.sum ? Number(result.sum) : 0,
      min: result?.min ? Number(result.min) : 0,
      max: result?.max ? Number(result.max) : 0,
    };

    await this.resultsService.saveResult(request, response);

    return response;
  }

  async getRequestStats() {
    const total = await this.analyticsRepo.count();

    const byTypeRaw = await this.analyticsRepo
      .createQueryBuilder('req')
      .select('req.aggregationType', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('req.aggregationType')
      .getRawMany<{ type: string; count: string }>();

    const topUsersRaw = await this.analyticsRepo
      .createQueryBuilder('req')
      .select('req.userId', 'userId')
      .addSelect('COUNT(*)', 'count')
      .where('req.userId IS NOT NULL')
      .groupBy('req.userId')
      .orderBy('count', 'DESC')
      .limit(5)
      .getRawMany<{ userId: number; count: string }>();

    return {
      totalRequests: total,
      byType: byTypeRaw.map((item) => ({
        type: item.type,
        count: Number(item.count),
      })),
      topUsers: topUsersRaw.map((item) => ({
        userId: Number(item.userId),
        count: Number(item.count),
      })),
    };
  }

  private async logRequest(dto: CreateAnalyticsDto) {
    const request = this.analyticsRepo.create({
      ...dto,
      user: dto.userId ? { id: dto.userId } : undefined,
    });

    return this.analyticsRepo.save(request);
  }
}
