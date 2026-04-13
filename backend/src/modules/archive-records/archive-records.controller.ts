import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { ArchiveRecordsService } from './archive-records.service';
import {
  CreateArchiveRecordDto,
  QueryArchiveRecordsDto,
  UpdateArchiveRecordDto,
} from './dto';
import { parseMapping } from './import/parsers';

@Controller('archive-records')
export class ArchiveRecordsController {
  constructor(private readonly archiveRecordsService: ArchiveRecordsService) {}

  @Post()
  create(@Body() createArchiveRecordDto: CreateArchiveRecordDto) {
    return this.archiveRecordsService.create(createArchiveRecordDto);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async import(
    @UploadedFile() file: Express.Multer.File,
    @Body('mapping') mappingRaw: string,
    @Req() req: Request & { user: { id: number } },
  ) {
    const mapping = mappingRaw ? parseMapping(mappingRaw) : {};

    return this.archiveRecordsService.importFromFile(
      file,
      mapping,
      req.user?.id ?? 1,
    );
  }

  @Post('preview')
  @UseInterceptors(FileInterceptor('file'))
  preview(@UploadedFile() file: Express.Multer.File) {
    return this.archiveRecordsService.previewImport(file);
  }

  @Post('preview-with-mapping')
  @UseInterceptors(FileInterceptor('file'))
  previewWithMapping(
    @UploadedFile() file: Express.Multer.File,
    @Body('mapping') mappingRaw: string,
  ) {
    const mapping = mappingRaw ? parseMapping(mappingRaw) : {};

    return this.archiveRecordsService.previewWithMapping(file, mapping);
  }

  @Get()
  findAll(@Query() query: QueryArchiveRecordsDto) {
    return this.archiveRecordsService.findAll(query);
  }

  @Get('meta')
  getMeta(@Req() req: Request & { user: { id: number } }) {
    return this.archiveRecordsService.getMeta(req.user?.id ?? 1);
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

  @Delete()
  removeMany(@Body() body: { ids: number[] }) {
    return this.archiveRecordsService.removeMany(body.ids);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.archiveRecordsService.remove(+id);
  }
}
