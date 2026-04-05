import { Expose } from 'class-transformer';

export class ByCategoryResponseDto {
  @Expose()
  category: string;

  @Expose()
  avg: number;

  @Expose()
  count: number;
}
