import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class AnalyticsFilterDto {
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

  @ApiPropertyOptional({
    description: 'Идентификатор пользователя.',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  userId?: number;

  @ApiPropertyOptional({
    description: 'Фильтр по тегу.',
    example: 'sensor',
  })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({
    description: 'Фильтр по единице измерения.',
    example: 'celsius',
  })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({
    description: 'Поиск по категории.',
    example: 'temperature',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Минимальное значение.',
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minValue?: number;

  @ApiPropertyOptional({
    description: 'Максимальное значение.',
    example: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxValue?: number;
}
