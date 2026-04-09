import { BadRequestException } from '@nestjs/common';
import { metadataSchema } from './metadata.schema';
import { ColumnMapping } from './types';

export function parseDate(input: unknown): Date {
  if (!input) return new Date();

  if (typeof input === 'number') {
    return new Date((input - 25569) * 86400 * 1000);
  }

  if (input instanceof Date) {
    return input;
  }

  if (typeof input === 'string') {
    const date = new Date(input);
    return isNaN(date.getTime()) ? new Date() : date;
  }

  throw new BadRequestException(`Invalid date value: ${JSON.stringify(input)}`);
}

export function parseNumber(value: unknown, index: number): number {
  if (typeof value === 'number') return value;

  if (typeof value === 'string') {
    const parsed = Number(value);
    if (!isNaN(parsed)) return parsed;
  }

  throw new BadRequestException(
    `Invalid value at row ${index}: ${JSON.stringify(value)} is not a number`,
  );
}

export function parseString(
  value: unknown,
  field: string,
  index: number,
): string {
  if (typeof value === 'string') return value;

  if (typeof value === 'number') return String(value);

  throw new BadRequestException(
    `Invalid ${field} at row ${index}: ${JSON.stringify(value)} is not a string`,
  );
}

export function parseMetadata(
  raw: Record<string, unknown>,
  index: number,
): Record<string, any> | undefined {
  if (!Object.keys(raw).length) return undefined;

  const result = metadataSchema.safeParse(raw);

  if (!result.success) {
    throw new BadRequestException(
      `Invalid metadata at row ${index}: ${result.error.message}`,
    );
  }

  return result.data;
}

export function parseMapping(mappingRaw: string): ColumnMapping {
  try {
    const parsed = JSON.parse(mappingRaw) as ColumnMapping;

    return {
      value: typeof parsed.value === 'string' ? parsed.value : undefined,
      category:
        typeof parsed.category === 'string' ? parsed.category : undefined,
      created_at:
        typeof parsed.created_at === 'string' ? parsed.created_at : undefined,
    };
  } catch {
    throw new BadRequestException('Invalid mapping JSON');
  }
}
