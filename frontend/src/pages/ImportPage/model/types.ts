export type PreviewRecord = {
  category: string;
  value: number;
  unit?: string;
  userId?: number;
  created_at: string;
  metadata?: Record<string, unknown>;
};

export type MappedPreviewRecord = {
  category?: string;
  value?: number;
  unit?: string;
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
  generated?: number;
  mode?: "single" | "wide";
  preview: RawPreviewRow[];
  columns: string[];
  mapping: ColumnMapping;
};

export type PreviewWithMappingResponse = {
  total: number;
  generated?: number;
  mode?: "single" | "wide";
  valid: number;
  invalid: number;
  errors: string[];
  preview: MappedPreviewRow[];
};

export type ImportResponse = {
  total: number;
  generated?: number;
  mode?: "single" | "wide";
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

  tag?: string;
  unit?: string;

  manualTag?: string;
  manualUnit?: string;
};
