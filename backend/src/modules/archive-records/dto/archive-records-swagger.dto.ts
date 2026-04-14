import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ColumnMappingDto {
  @ApiPropertyOptional({ example: 'Value' })
  value?: string;

  @ApiPropertyOptional({ example: 'Category' })
  category?: string;

  @ApiPropertyOptional({ example: 'Date' })
  created_at?: string;

  @ApiPropertyOptional({ example: 'Tag' })
  tag?: string;

  @ApiPropertyOptional({ example: 'Unit' })
  unit?: string;

  @ApiPropertyOptional({ example: 'manual-tag' })
  manualTag?: string;

  @ApiPropertyOptional({ example: 'manual-unit' })
  manualUnit?: string;
}

export class ArchiveRecordDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: 'sensor' })
  tag: string;

  @ApiPropertyOptional({ example: 'celsius' })
  unit?: string;

  @ApiProperty({ example: 'temperature' })
  category: string;

  @ApiProperty({ example: 23.5 })
  value: number;

  @ApiPropertyOptional({ example: { source: 'lab-1' } })
  metadata?: Record<string, unknown>;

  @ApiPropertyOptional({ example: 1 })
  userId?: number;
}

export class ArchiveRecordsListResponseDto {
  @ApiProperty({ type: [ArchiveRecordDto] })
  data: ArchiveRecordDto[];

  @ApiProperty({ example: 120 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;
}

export class RawPreviewRowDto {
  @ApiProperty({ example: 0 })
  index: number;

  @ApiProperty({ example: { Category: 'temperature', Value: '23.5' } })
  raw: Record<string, unknown>;

  @ApiProperty({ example: true })
  isValid: boolean;

  @ApiProperty({ type: [String], example: [] })
  errors: string[];
}

export class ParsedPreviewRowDto {
  @ApiProperty({ example: 0 })
  index: number;

  @ApiProperty({
    example: {
      category: 'temperature',
      value: 23.5,
      tag: 'sensor',
      unit: 'celsius',
      created_at: '2026-04-14T10:00:00.000Z',
    },
  })
  data: Record<string, unknown>;

  @ApiProperty({ example: true })
  isValid: boolean;

  @ApiProperty({ type: [String], example: [] })
  errors: string[];
}

export class PreviewImportResponseDto {
  @ApiProperty({ example: 50 })
  total: number;

  @ApiProperty({ type: [RawPreviewRowDto] })
  preview: RawPreviewRowDto[];

  @ApiProperty({ type: [String], example: ['Category', 'Value', 'Date'] })
  columns: string[];

  @ApiProperty({ type: ColumnMappingDto })
  mapping: ColumnMappingDto;
}

export class PreviewWithMappingResponseDto {
  @ApiProperty({ example: 50 })
  total: number;

  @ApiProperty({ example: 45 })
  valid: number;

  @ApiProperty({ example: 5 })
  invalid: number;

  @ApiProperty({ type: [String], example: ['Row 4: category and value are required'] })
  errors: string[];

  @ApiProperty({ type: [ParsedPreviewRowDto] })
  preview: ParsedPreviewRowDto[];
}

export class ImportResultDto {
  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 96 })
  parsed: number;

  @ApiProperty({ example: 96 })
  valid: number;

  @ApiProperty({ example: 90 })
  inserted: number;

  @ApiProperty({ example: 10 })
  skipped: number;

  @ApiProperty({ example: 4 })
  invalid: number;

  @ApiProperty({ type: [String], example: ['Row 7: invalid date'] })
  errors: string[];
}

export class MetaOptionDto {
  @ApiProperty({ example: 'sensor' })
  value: string;

  @ApiProperty({ example: 20 })
  count: number;
}

export class ArchiveMetaResponseDto {
  @ApiProperty({ type: [MetaOptionDto] })
  tags: MetaOptionDto[];

  @ApiProperty({ type: [MetaOptionDto] })
  units: MetaOptionDto[];
}
