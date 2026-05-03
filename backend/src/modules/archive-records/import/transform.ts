import { ColumnMapping, NormalizedRecord, RawRow, WideModeInfo } from './types';
import { parseDate, parseMetadata, parseNumber, parseString } from './parsers';

function normalizeLabel(value: string): string {
  return value.trim().toLowerCase();
}

const KNOWN_UNITS = new Set([
  'час',
  'ч',
  'т',
  'тонн',
  'т/час',
  'г/т',
  'гр',
  'кг',
  '%',
]);

const SORTED_UNITS = Array.from(KNOWN_UNITS).sort(
  (a, b) => b.length - a.length,
);

function splitCategoryAndUnit(header: string): {
  category: string;
  unit?: string;
} {
  const normalizedHeader = header.trim();

  for (const unit of SORTED_UNITS) {
    const slashSuffix = ` / ${unit}`;
    const commaSuffix = `, ${unit}`;

    if (
      normalizeLabel(normalizedHeader).endsWith(normalizeLabel(slashSuffix))
    ) {
      return {
        category: normalizedHeader.slice(0, -slashSuffix.length).trim(),
        unit,
      };
    }

    if (
      normalizeLabel(normalizedHeader).endsWith(normalizeLabel(commaSuffix))
    ) {
      return {
        category: normalizedHeader.slice(0, -commaSuffix.length).trim(),
        unit,
      };
    }
  }

  const parts = header
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length <= 1) {
    const commaUnitMatch = header.trim().match(/^(.*?),\s*([^,]+)$/);

    if (commaUnitMatch) {
      const [, prefix, maybeUnit] = commaUnitMatch;
      const normalizedUnit = normalizeLabel(maybeUnit);

      if (KNOWN_UNITS.has(normalizedUnit)) {
        return {
          category: prefix.trim(),
          unit: normalizedUnit,
        };
      }
    }

    return { category: header.trim() };
  }

  const lastPart = parts.at(-1);

  if (lastPart) {
    const normalizedLast = normalizeLabel(lastPart);

    if (KNOWN_UNITS.has(normalizedLast)) {
      return {
        category: parts.slice(0, -1).join(' / '),
        unit: normalizedLast,
      };
    }

    const commaUnitMatch = lastPart.match(/^(.*?),\s*([^,]+)$/);

    if (commaUnitMatch) {
      const [, prefix, maybeUnit] = commaUnitMatch;
      const normalizedUnit = normalizeLabel(maybeUnit);

      if (KNOWN_UNITS.has(normalizedUnit)) {
        return {
          category: [...parts.slice(0, -1), prefix.trim()].join(' / '),
          unit: normalizedUnit,
        };
      }
    }
  }

  return { category: normalizedHeader };
}

function getMappedValue(
  row: RawRow,
  selectedColumn: string | undefined,
  manualValue: string | undefined,
): unknown {
  if (selectedColumn === 'manual') {
    return manualValue;
  }

  return selectedColumn ? row[selectedColumn] : undefined;
}

function getExcludedColumns(mapping: ColumnMapping): Set<string> {
  return new Set(
    [
      mapping.created_at,
      mapping.category,
      mapping.value,
      mapping.tag && mapping.tag !== 'manual' ? mapping.tag : undefined,
      mapping.unit && mapping.unit !== 'manual' ? mapping.unit : undefined,
    ].filter((value): value is string => Boolean(value)),
  );
}

function isNumericCell(value: unknown): boolean {
  if (typeof value === 'number') return true;
  if (typeof value === 'string' && value.trim()) {
    return !Number.isNaN(Number(value));
  }

  return false;
}

function shouldExcludeWideColumn(column: string): boolean {
  const normalized = normalizeLabel(column);

  return (
    normalized === 'смена' ||
    normalized === 'дата' ||
    normalized.includes('смена') ||
    normalized.includes('дата') ||
    normalized.includes('норма') ||
    normalized.includes('ед.измер') ||
    normalized.includes('ед. измер')
  );
}

export function resolveWideModeColumns(
  rows: RawRow[],
  mapping: ColumnMapping,
): WideModeInfo {
  const excluded = getExcludedColumns(mapping);
  const allColumns = Object.keys(rows[0] ?? {});
  const valueColumns = allColumns.filter(
    (column) =>
      !excluded.has(column) && rows.some((row) => isNumericCell(row[column])),
  );

  return {
    enabled: !mapping.value,
    valueColumns: valueColumns.filter(
      (column) => !shouldExcludeWideColumn(column),
    ),
  };
}

function buildMetadata(
  row: RawRow,
  index: number,
  mapping: ColumnMapping,
  valueColumn?: string,
  wideValueColumns: string[] = [],
): Record<string, unknown> | undefined {
  const metadata = { ...row };
  const omitted = new Set([
    mapping.created_at,
    mapping.category,
    mapping.value,
    valueColumn,
    mapping.tag && mapping.tag !== 'manual' ? mapping.tag : undefined,
    mapping.unit && mapping.unit !== 'manual' ? mapping.unit : undefined,
    ...wideValueColumns,
  ]);

  omitted.forEach((key) => {
    if (key) {
      delete metadata[key];
    }
  });

  return parseMetadata(metadata, index);
}

export function normalizeSingleRecord(
  row: RawRow,
  index: number,
  mapping: ColumnMapping,
  currentUserId: number,
): NormalizedRecord {
  const valueRaw = mapping.value ? row[mapping.value] : undefined;
  const categoryRaw = mapping.category ? row[mapping.category] : undefined;
  const createdAtRaw = mapping.created_at ? row[mapping.created_at] : undefined;
  const tagRaw = getMappedValue(row, mapping.tag, mapping.manualTag);
  const unitRaw = getMappedValue(row, mapping.unit, mapping.manualUnit);

  if (valueRaw == null) {
    throw new Error('value is required');
  }

  const derivedCategory =
    categoryRaw ??
    mapping.value ??
    (mapping.manualTag?.trim() ? mapping.manualTag : undefined);
  const derivedFromHeader =
    !categoryRaw && mapping.value ? splitCategoryAndUnit(mapping.value) : null;

  if (derivedCategory == null) {
    throw new Error('category or value mapping is required');
  }

  return {
    tag: tagRaw ? normalizeLabel(parseString(tagRaw, 'tag', index)) : 'default',
    category: derivedFromHeader?.category
      ? derivedFromHeader.category
      : parseString(derivedCategory, 'category', index),
    value: parseNumber(valueRaw, index),
    userId: currentUserId,
    created_at: createdAtRaw ? parseDate(createdAtRaw) : new Date(),
    unit: unitRaw
      ? normalizeLabel(parseString(unitRaw, 'unit', index))
      : derivedFromHeader?.unit,
    metadata: buildMetadata(row, index, mapping, mapping.value),
  };
}

export function normalizeWideRecords(
  row: RawRow,
  index: number,
  mapping: ColumnMapping,
  currentUserId: number,
  wideValueColumns: string[],
): NormalizedRecord[] {
  const createdAtRaw = mapping.created_at ? row[mapping.created_at] : undefined;
  const categoryRaw = mapping.category ? row[mapping.category] : undefined;
  const tagRaw = getMappedValue(row, mapping.tag, mapping.manualTag);
  const unitRaw = getMappedValue(row, mapping.unit, mapping.manualUnit);
  const tag = tagRaw
    ? normalizeLabel(parseString(tagRaw, 'tag', index))
    : 'default';
  const explicitUnit = unitRaw
    ? normalizeLabel(parseString(unitRaw, 'unit', index))
    : undefined;

  return wideValueColumns.flatMap((valueColumn) => {
    const rawValue = row[valueColumn];

    if (rawValue == null || rawValue === '') {
      return [];
    }

    const derived = splitCategoryAndUnit(valueColumn);
    const categoryPrefix =
      categoryRaw != null
        ? parseString(categoryRaw, 'category', index)
        : undefined;

    return [
      {
        tag,
        category: categoryPrefix
          ? `${categoryPrefix} / ${derived.category}`
          : derived.category,
        value: parseNumber(rawValue, index),
        userId: currentUserId,
        created_at: createdAtRaw ? parseDate(createdAtRaw) : new Date(),
        unit: explicitUnit ?? derived.unit,
        metadata: buildMetadata(
          row,
          index,
          mapping,
          valueColumn,
          wideValueColumns,
        ),
      },
    ];
  });
}
