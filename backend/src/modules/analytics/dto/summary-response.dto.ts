import { Expose } from 'class-transformer';

export class SummaryResponseDto {
  @Expose()
  avg: number;

  @Expose()
  count: number;

  @Expose()
  sum: number;

  @Expose()
  min: number;

  @Expose()
  max: number;
}
