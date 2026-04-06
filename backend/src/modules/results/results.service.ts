import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyticsResult } from './entities/result.entity';
import { Injectable } from '@nestjs/common';
import { AnalyticsRequest } from '../analytics/entities/analytics.entity';

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

  findAll() {
    return this.resultRepo.find({ relations: ['request'] });
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
}
