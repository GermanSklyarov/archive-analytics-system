import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyticsRequest } from '../analytics/entities/analytics.entity';
import { GetResultsQueryDto } from './dto';
import { AnalyticsResult } from './entities/result.entity';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(AnalyticsResult)
    private readonly resultRepo: Repository<AnalyticsResult>,
  ) {}

  async saveResult(request: AnalyticsRequest, data: unknown) {
    const result = this.resultRepo.create({
      request,
      data,
      aggregationType: request.aggregationType,
      userId: request.user?.id,
      dateFrom: request.dateFrom,
      dateTo: request.dateTo,
    });

    return this.resultRepo.save(result);
  }

  async findAll(query: GetResultsQueryDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      order = 'DESC',
    } = query;

    const [data, total] = await this.resultRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { [sortBy]: order },
      where: {
        ...(query.userId && { userId: query.userId }),
        ...(query.aggregationType && {
          aggregationType: query.aggregationType,
        }),
      },
    });

    return { data, total };
  }

  findOne(id: number) {
    return this.resultRepo.findOne({
      where: { id },
      relations: ['request'],
    });
  }

  async findByRequest(requestId: number) {
    return this.resultRepo.findOne({
      where: {
        request: { id: requestId },
      },
      relations: ['request'],
    });
  }

  async removeMany(ids: number[]) {
    await this.resultRepo.delete(ids);
    return { ids };
  }
}
