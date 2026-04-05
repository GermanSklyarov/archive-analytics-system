import { Expose } from 'class-transformer';

class RequestByTypeDto {
  @Expose()
  type: string;

  @Expose()
  count: number;
}

class TopUserDto {
  @Expose()
  userId: number;

  @Expose()
  count: number;
}

export class RequestsStatsDto {
  @Expose()
  totalRequests: number;

  @Expose()
  byType: RequestByTypeDto[];

  @Expose()
  topUsers: TopUserDto[];
}
