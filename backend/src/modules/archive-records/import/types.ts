export type RawRow = Record<string, unknown>;

export type RawPreviewRow = {
  index: number;
  raw: RawRow;
  isValid: boolean;
  errors: string[];
};

export type NormalizedRecord = {
  tag: string;
  category: string;
  value: number;
  created_at: Date;

  unit?: string;
  userId?: number;
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

  tag?: string;
  unit?: string;

  manualTag?: string;
  manualUnit?: string;
};

export type WideModeInfo = {
  enabled: boolean;
  valueColumns: string[];
};

export type RequiredColumnMapping = {
  value: string;
  category: string;
  created_at: string;
};

export type PreviewImportResponse = {
  total: number;
  generated?: number;
  mode?: 'single' | 'wide';
  preview: RawPreviewRow[];
  columns: string[];
  mapping: ColumnMapping;
};

export type TagRow = {
  tag: string;
  count: string;
};

export type UnitRow = {
  unit: string;
  count: string;
};
