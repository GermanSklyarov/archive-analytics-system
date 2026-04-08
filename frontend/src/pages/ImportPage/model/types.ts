export type PreviewRecord = {
  category: string;
  value: number;
  userId?: number;
  created_at: string;
  metadata?: Record<string, unknown>;
};

export type PreviewRow = {
  index: number;
  data: Partial<PreviewRecord>;
  isValid: boolean;
  errors: string[];
};

export type PreviewResponse = {
  total: number;
  valid: number;
  invalid: number;
  errors: string[];
  preview: PreviewRow[];
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
