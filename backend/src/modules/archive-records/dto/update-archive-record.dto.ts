import { PartialType } from '@nestjs/mapped-types';
import { CreateArchiveRecordDto } from './create-archive-record.dto';

export class UpdateArchiveRecordDto extends PartialType(
  CreateArchiveRecordDto,
) {}
