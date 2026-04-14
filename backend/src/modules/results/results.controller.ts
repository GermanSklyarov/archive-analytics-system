import { Body, Controller, Delete, Get, Param, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RemoveManyDto } from '../../common/dto/remove-many.dto';
import { GetResultsQueryDto } from './dto';
import {
  AnalyticsResultDto,
  ResultsListResponseDto,
} from './dto/results-swagger.dto';
import { ResultsService } from './results.service';

@ApiTags('Results')
@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @ApiOperation({ summary: 'Получить историю результатов аналитики' })
  @ApiOkResponse({ type: ResultsListResponseDto })
  @Get()
  findAll(@Query() query: GetResultsQueryDto) {
    return this.resultsService.findAll(query);
  }

  @ApiOperation({ summary: 'Получить сохраненный результат по идентификатору' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ type: AnalyticsResultDto })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resultsService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Получить результат по идентификатору аналитического запроса',
  })
  @ApiParam({ name: 'requestId', type: Number, example: 1 })
  @ApiOkResponse({ type: AnalyticsResultDto })
  @Get('by-request/:requestId')
  findByRequest(@Param('requestId') requestId: string) {
    return this.resultsService.findByRequest(+requestId);
  }

  @ApiOperation({ summary: 'Массово удалить результаты' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: { ids: { type: 'array', items: { type: 'number' } } },
    },
  })
  @Delete()
  removeMany(@Body() body: RemoveManyDto) {
    return this.resultsService.removeMany(body.ids);
  }
}
