import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AnalyticsService } from './analytics.service';
import {
  AnalyticsFilterDto,
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
  getAverage(@Query() query: AnalyticsFilterDto) {
    return this.analyticsService.getAverage(query);
  }

  @ApiOperation({ summary: 'Аналитика по категориям' })
  @Get('by-category')
  async getByCategory(@Query() query: AnalyticsFilterDto) {
    const data = await this.analyticsService.getByCategory(query);

    return plainToInstance(ByCategoryResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({ summary: 'Аналитика по датам' })
  @Get('by-date')
  async getByDate(@Query() query: AnalyticsFilterDto) {
    const data = await this.analyticsService.getByDate(query);

    return plainToInstance(ByDateResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({ summary: 'Получить общую статистику' })
  @ApiResponse({ status: 200, description: 'Успешный ответ' })
  @ApiQuery(AnalyticsFilterDto)
  @Get('summary')
  async getSummary(@Query() query: AnalyticsFilterDto) {
    const data = await this.analyticsService.getSummary(query);

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
