import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetResultsQueryDto {
  @ApiPropertyOptional({
    description: 'Номер страницы.',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Количество элементов на странице.',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Поле сортировки.',
    example: 'created_at',
    enum: [
      'created_at',
      'id',
      'dateFrom',
      'dateTo',
      'aggregationType',
      'userId',
    ],
    default: 'created_at',
  })
  @IsOptional()
  @IsString()
  @IsIn(['created_at', 'id', 'dateFrom', 'dateTo', 'aggregationType', 'userId'])
  sortBy?: string = 'created_at';

  @ApiPropertyOptional({
    description: 'Направление сортировки.',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({
    description: 'Фильтр по пользователю.',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  userId?: number;

  @ApiPropertyOptional({
    description: 'Фильтр по типу агрегации.',
    example: 'summary',
  })
  @IsOptional()
  @IsString()
  aggregationType?: string;
}
