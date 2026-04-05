import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ArchiveRecordsService } from './archive-records.service';
import {
  CreateArchiveRecordDto,
  QueryArchiveRecordsDto,
  UpdateArchiveRecordDto,
} from './dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('archive-records')
export class ArchiveRecordsController {
  constructor(private readonly archiveRecordsService: ArchiveRecordsService) {}

  @Post()
  create(@Body() createArchiveRecordDto: CreateArchiveRecordDto) {
    return this.archiveRecordsService.create(createArchiveRecordDto);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importFile(@UploadedFile() file: Express.Multer.File) {
    return this.archiveRecordsService.importFromFile(file);
  }

  @Get()
  findAll(@Query() query: QueryArchiveRecordsDto) {
    return this.archiveRecordsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.archiveRecordsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateArchiveRecordDto: UpdateArchiveRecordDto,
  ) {
    return this.archiveRecordsService.update(+id, updateArchiveRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.archiveRecordsService.remove(+id);
  }
}
