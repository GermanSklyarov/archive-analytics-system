import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SummaryResponseDto {
  @ApiProperty({ description: 'Среднее значение.', example: 18.2 })
  @Expose()
  avg: number;

  @ApiProperty({ description: 'Количество записей.', example: 1240 })
  @Expose()
  count: number;

  @ApiProperty({ description: 'Сумма значений.', example: 22568.4 })
  @Expose()
  sum: number;

  @ApiProperty({ description: 'Минимальное значение.', example: 1.2 })
  @Expose()
  min: number;

  @ApiProperty({ description: 'Максимальное значение.', example: 98.6 })
  @Expose()
  max: number;
}
