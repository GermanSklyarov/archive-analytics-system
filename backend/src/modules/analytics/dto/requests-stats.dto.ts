import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

class RequestByTypeDto {
  @ApiProperty({ description: 'Тип агрегации.', example: 'summary' })
  @Expose()
  type: string;

  @ApiProperty({ description: 'Количество запросов.', example: 25 })
  @Expose()
  count: number;
}

class TopUserDto {
  @ApiProperty({ description: 'Идентификатор пользователя.', example: 1 })
  @Expose()
  userId: number;

  @ApiProperty({ description: 'Количество запросов пользователя.', example: 8 })
  @Expose()
  count: number;
}

export class RequestsStatsDto {
  @ApiProperty({ description: 'Общее количество аналитических запросов.', example: 42 })
  @Expose()
  totalRequests: number;

  @ApiProperty({ type: [RequestByTypeDto] })
  @Expose()
  byType: RequestByTypeDto[];

  @ApiProperty({ type: [TopUserDto] })
  @Expose()
  topUsers: TopUserDto[];
}
