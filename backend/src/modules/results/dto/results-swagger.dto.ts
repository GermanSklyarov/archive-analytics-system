import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AnalyticsResultDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'summary' })
  aggregationType: string;

  @ApiProperty({ example: { avg: 12.3, count: 10, sum: 123, min: 1, max: 40 } })
  data: unknown;

  @ApiPropertyOptional({ example: 1 })
  userId?: number;

  @ApiPropertyOptional({ example: '2026-04-01T00:00:00.000Z' })
  dateFrom?: string;

  @ApiPropertyOptional({ example: '2026-04-14T23:59:59.999Z' })
  dateTo?: string;

  @ApiProperty({ example: '2026-04-14T10:15:00.000Z' })
  created_at: Date;
}

export class ResultsListResponseDto {
  @ApiProperty({ type: [AnalyticsResultDto] })
  data: AnalyticsResultDto[];

  @ApiProperty({ example: 24 })
  total: number;
}
