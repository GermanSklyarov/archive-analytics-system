export type PreviewRecord = {
  category: string;
  value: number;
  userId?: number;
  created_at: string;
  metadata?: Record<string, unknown>;
};

export type MappedPreviewRecord = {
  category?: string;
  value?: number;
  userId?: number;
  created_at?: string;
  metadata?: Record<string, unknown>;
};

export type RawPreviewRow = {
  index: number;
  raw: Record<string, unknown>;
  isValid: boolean;
  errors: string[];
};

export type MappedPreviewRow = {
  index: number;
  data: MappedPreviewRecord | null;
  isValid: boolean;
  errors: string[];
};

export type PreviewResponse = {
  total: number;
  preview: RawPreviewRow[];
  columns: string[];
  mapping: ColumnMapping;
};

export type PreviewWithMappingResponse = {
  total: number;
  valid: number;
  invalid: number;
  errors: string[];
  preview: MappedPreviewRow[];
};

export type ImportResponse = {
  total: number;
  parsed: number;
  valid: number;
  inserted: number;
  skipped: number;
  invalid: number;
  errors: string[];
};

export type ColumnMapping = {
  value?: string;
  category?: string;
  created_at?: string;
};
