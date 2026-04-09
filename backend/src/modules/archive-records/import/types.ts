export type RawRow = Record<string, unknown>;

export type RawPreviewRow = {
  index: number;
  raw: RawRow;
  isValid: boolean;
  errors: string[];
};

export type NormalizedRecord = {
  category: string;
  value: number;
  userId?: number;
  created_at: Date;
  metadata?: Record<string, unknown>;
};

export type PreviewRow = {
  index: number;
  data: Partial<NormalizedRecord>;
  isValid: boolean;
  errors: string[];
};

export type ColumnMapping = {
  value?: string;
  category?: string;
  created_at?: string;
};

export type RequiredColumnMapping = {
  value: string;
  category: string;
  created_at: string;
};

export type PreviewImportResponse = {
  total: number;
  preview: RawPreviewRow[];
  columns: string[];
  mapping: ColumnMapping;
};
