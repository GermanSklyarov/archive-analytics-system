import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ByDateResponseDto {
  @ApiProperty({ description: 'Дата агрегации.', example: '2026-04-14' })
  @Expose()
  date: string;

  @ApiProperty({ description: 'Среднее значение за дату.', example: 18.2 })
  @Expose()
  avg: number;

  @ApiProperty({ description: 'Количество записей.', example: 40 })
  @Expose()
  count: number;

  @ApiProperty({ description: 'Сумма значений.', example: 728 })
  @Expose()
  sum: number;

  @ApiProperty({ description: 'Минимальное значение.', example: 5.1 })
  @Expose()
  min: number;

  @ApiProperty({ description: 'Максимальное значение.', example: 34.2 })
  @Expose()
  max: number;
}
