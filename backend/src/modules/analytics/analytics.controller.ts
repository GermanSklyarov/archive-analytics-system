import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AnalyticsService } from './analytics.service';
import {
  ByCategoryResponseDto,
  ByDateResponseDto,
  RequestsStatsDto,
  SummaryResponseDto,
} from './dto';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('average')
  getAverage(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.analyticsService.getAverage(dateFrom, dateTo);
  }

  @ApiOperation({ summary: 'Аналитика по категориям' })
  @Get('by-category')
  async getByCategory(@Query('userId') userId?: number) {
    const data = await this.analyticsService.getByCategory(userId);

    return plainToInstance(ByCategoryResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({ summary: 'Аналитика по датам' })
  @Get('by-date')
  async getByDate(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('userId') userId?: number,
  ) {
    const data = await this.analyticsService.getByDate(
      dateFrom,
      dateTo,
      userId,
    );

    return plainToInstance(ByDateResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({ summary: 'Получить общую статистику' })
  @ApiResponse({ status: 200, description: 'Успешный ответ' })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @Get('summary')
  async getSummary(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('userId') userId?: number,
  ) {
    const data = await this.analyticsService.getSummary(
      dateFrom,
      dateTo,
      userId,
    );

    return plainToInstance(SummaryResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({ summary: 'Статистика аналитических запросов' })
  @Get('requests/stats')
  async getStats() {
    const data = await this.analyticsService.getRequestStats();

    return plainToInstance(RequestsStatsDto, data, {
      excludeExtraneousValues: true,
    });
  }
}
