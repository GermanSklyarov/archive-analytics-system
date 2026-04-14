import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
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
import { RemoveManyDto } from '../../common/dto/remove-many.dto';
import { ArchiveRecordsService } from './archive-records.service';
import {
  CreateArchiveRecordDto,
  QueryArchiveRecordsDto,
  UpdateArchiveRecordDto,
} from './dto';
import {
  ArchiveMetaResponseDto,
  ArchiveRecordDto,
  ArchiveRecordsListResponseDto,
  ImportResultDto,
  PreviewImportResponseDto,
  PreviewWithMappingResponseDto,
} from './dto/archive-records-swagger.dto';
import { parseMapping } from './import/parsers';

@ApiTags('Archive Records')
@Controller('archive-records')
export class ArchiveRecordsController {
  constructor(private readonly archiveRecordsService: ArchiveRecordsService) {}

  @ApiOperation({ summary: 'Создать архивную запись' })
  @ApiOkResponse({ type: ArchiveRecordDto })
  @Post()
  create(@Body() createArchiveRecordDto: CreateArchiveRecordDto) {
    return this.archiveRecordsService.create(createArchiveRecordDto);
  }

  @ApiOperation({ summary: 'Импортировать записи из файла' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary' },
        mapping: {
          type: 'string',
          example:
            '{"value":"Value","category":"Category","created_at":"Date","tag":"Tag","unit":"Unit"}',
        },
      },
    },
  })
  @ApiOkResponse({ type: ImportResultDto })
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

  @ApiOperation({ summary: 'Показать сырой предпросмотр файла и автоопределенный маппинг' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOkResponse({ type: PreviewImportResponseDto })
  @Post('preview')
  @UseInterceptors(FileInterceptor('file'))
  preview(@UploadedFile() file: Express.Multer.File) {
    return this.archiveRecordsService.previewImport(file);
  }

  @ApiOperation({ summary: 'Показать предпросмотр после ручного маппинга колонок' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'mapping'],
      properties: {
        file: { type: 'string', format: 'binary' },
        mapping: {
          type: 'string',
          example:
            '{"value":"Value","category":"Category","created_at":"Date","tag":"manual","manualTag":"sensor","unit":"Unit"}',
        },
      },
    },
  })
  @ApiOkResponse({ type: PreviewWithMappingResponseDto })
  @Post('preview-with-mapping')
  @UseInterceptors(FileInterceptor('file'))
  previewWithMapping(
    @UploadedFile() file: Express.Multer.File,
    @Body('mapping') mappingRaw: string,
  ) {
    const mapping = mappingRaw ? parseMapping(mappingRaw) : {};

    return this.archiveRecordsService.previewWithMapping(file, mapping);
  }

  @ApiOperation({ summary: 'Получить список архивных записей' })
  @ApiOkResponse({ type: ArchiveRecordsListResponseDto })
  @Get()
  findAll(@Query() query: QueryArchiveRecordsDto) {
    return this.archiveRecordsService.findAll(query);
  }

  @ApiOperation({ summary: 'Получить справочники тегов и единиц измерения' })
  @ApiOkResponse({ type: ArchiveMetaResponseDto })
  @Get('meta')
  getMeta(@Req() req: Request & { user: { id: number } }) {
    return this.archiveRecordsService.getMeta(req.user?.id ?? 1);
  }

  @ApiOperation({ summary: 'Получить архивную запись по идентификатору' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ type: ArchiveRecordDto })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.archiveRecordsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Обновить архивную запись' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ type: ArchiveRecordDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateArchiveRecordDto: UpdateArchiveRecordDto,
  ) {
    return this.archiveRecordsService.update(+id, updateArchiveRecordDto);
  }

  @ApiOperation({ summary: 'Массово удалить архивные записи' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: { ids: { type: 'array', items: { type: 'number' } } },
    },
  })
  @Delete()
  removeMany(@Body() body: RemoveManyDto) {
    return this.archiveRecordsService.removeMany(body.ids);
  }

  @ApiOperation({ summary: 'Удалить архивную запись' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: { deleted: { type: 'boolean', example: true } },
    },
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.archiveRecordsService.remove(+id);
  }
}
