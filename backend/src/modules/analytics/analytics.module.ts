import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArchiveRecord } from '../archive-records/entities/archive-record.entity';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { AnalyticsRequest } from './entities/analytics.entity';
import { ResultsModule } from '../results/results.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnalyticsRequest, ArchiveRecord]),
    ResultsModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
