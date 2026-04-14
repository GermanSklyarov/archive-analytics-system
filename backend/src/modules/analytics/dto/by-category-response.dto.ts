import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ByCategoryResponseDto {
  @ApiProperty({ description: 'Категория.', example: 'temperature' })
  @Expose()
  category: string;

  @ApiProperty({ description: 'Среднее значение по категории.', example: 21.4 })
  @Expose()
  avg: number;

  @ApiProperty({ description: 'Количество записей.', example: 124 })
  @Expose()
  count: number;
}
