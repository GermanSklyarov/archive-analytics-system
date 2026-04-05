import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateArchiveRecordDto {
  @IsString()
  category: string;

  @IsNumber()
  value: number;

  @IsOptional()
  metadata?: Record<string, any>;

  @IsOptional()
  userId?: number;
}
