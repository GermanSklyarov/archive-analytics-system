import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateArchiveRecordDto {
  @ApiProperty({
    description: 'Категория архивной записи.',
    example: 'temperature',
  })
  @IsString()
  category: string;

  @ApiProperty({
    description: 'Числовое значение записи.',
    example: 23.5,
  })
  @IsNumber()
  value: number;

  @ApiPropertyOptional({
    description: 'Произвольные дополнительные метаданные.',
    example: { source: 'sensor-1', note: 'validated' },
  })
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Идентификатор пользователя-владельца записи.',
    example: 1,
  })
  @IsOptional()
  userId?: number;
}
