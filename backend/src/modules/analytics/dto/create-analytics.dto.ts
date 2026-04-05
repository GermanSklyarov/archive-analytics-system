import { IsDateString, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateAnalyticsDto {
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsString()
  aggregationType: string;

  @IsOptional()
  @IsNumber()
  userId?: number;
}
