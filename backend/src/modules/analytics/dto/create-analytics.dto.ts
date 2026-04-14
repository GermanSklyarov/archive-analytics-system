import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class AnalyticsFiltersDto {
  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  minValue?: number;

  @IsOptional()
  @IsNumber()
  maxValue?: number;
}

export class CreateAnalyticsDto {
  @ApiPropertyOptional({
    description: 'Начало периода анализа.',
    example: '2026-04-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({
    description: 'Конец периода анализа.',
    example: '2026-04-14T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiProperty({
    description: 'Тип выполняемой агрегации.',
    example: 'summary',
  })
  @IsString()
  aggregationType: string;

  @ApiPropertyOptional({
    description: 'Идентификатор пользователя.',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiPropertyOptional({
    description: 'Фильтры',
    example: {
      tag: 'Sales',
      unit: 'Rub',
      category: 'logistics',
      minValue: 100,
      maxValue: 1000,
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AnalyticsFiltersDto)
  filters?: AnalyticsFiltersDto;
}
