export type RawRow = {
  category?: unknown;
  value?: unknown;
  userId?: unknown;
  created_at?: unknown;
} & Record<string, unknown>;

export type ParsedRecord = {
  category: string;
  value: number;
  userId?: number;
  created_at: Date;
  metadata?: Record<string, any>;
};

export type PreviewRecord = {
  category: string;
  value: number;
  userId?: number;
  created_at: Date;
  metadata?: Record<string, unknown>;
};

export type PreviewRow = {
  index: number;
  data: Partial<PreviewRecord>;
  isValid: boolean;
  errors: string[];
};
