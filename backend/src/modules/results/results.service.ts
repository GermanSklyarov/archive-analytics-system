import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyticsResult } from './entities/result.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(AnalyticsResult)
    private readonly resultRepo: Repository<AnalyticsResult>,
  ) {}

  async saveResult(requestId: number, data: unknown) {
    const result = this.resultRepo.create({
      request: { id: requestId },
      result_data: data,
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
