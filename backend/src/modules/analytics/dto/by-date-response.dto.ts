import { Expose } from 'class-transformer';

export class ByDateResponseDto {
  @Expose()
  date: string;

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
