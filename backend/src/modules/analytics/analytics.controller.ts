import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
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

  @ApiOperation({ summary: 'Получить среднее значение по выбранным фильтрам' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        average: { type: 'number', example: 18.2 },
      },
    },
  })
  @Get('average')
  getAverage(@Query() query: AnalyticsFilterDto) {
    return this.analyticsService.getAverage(query);
  }

  @ApiOperation({ summary: 'Аналитика по категориям' })
  @ApiOkResponse({ type: ByCategoryResponseDto, isArray: true })
  @Get('by-category')
  async getByCategory(@Query() query: AnalyticsFilterDto) {
    const data = await this.analyticsService.getByCategory(query);

    return plainToInstance(ByCategoryResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({ summary: 'Аналитика по датам' })
  @ApiOkResponse({ type: ByDateResponseDto, isArray: true })
  @Get('by-date')
  async getByDate(@Query() query: AnalyticsFilterDto) {
    const data = await this.analyticsService.getByDate(query);

    return plainToInstance(ByDateResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({ summary: 'Получить общую статистику' })
  @ApiOkResponse({ type: SummaryResponseDto })
  @Get('summary')
  async getSummary(@Query() query: AnalyticsFilterDto) {
    const data = await this.analyticsService.getSummary(query);

    return plainToInstance(SummaryResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({ summary: 'Статистика аналитических запросов' })
  @ApiOkResponse({ type: RequestsStatsDto })
  @Get('requests/stats')
  async getStats() {
    const data = await this.analyticsService.getRequestStats();

    return plainToInstance(RequestsStatsDto, data, {
      excludeExtraneousValues: true,
    });
  }
}
