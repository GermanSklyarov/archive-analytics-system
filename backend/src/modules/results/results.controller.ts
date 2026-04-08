import { Body, Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { GetResultsQueryDto } from './dto';
import { ResultsService } from './results.service';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get()
  findAll(@Query() query: GetResultsQueryDto) {
    return this.resultsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resultsService.findOne(+id);
  }

  @Get('by-request/:requestId')
  findByRequest(@Param('requestId') requestId: string) {
    return this.resultsService.findByRequest(+requestId);
  }

  @Delete()
  removeMany(@Body() body: { ids: number[] }) {
    return this.resultsService.removeMany(body.ids);
  }
}
