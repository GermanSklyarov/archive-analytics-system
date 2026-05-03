import * as XLSX from 'xlsx';
import { RawRow } from './types';

function isNonEmpty(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === 'string') return value.trim() !== '';
  return true;
}

function isDateLikeString(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;

  const date = new Date(trimmed);
  return !Number.isNaN(date.getTime());
}

function formatExcelTime(value: number): string {
  const totalMinutes = Math.round((value % 1) * 24 * 60);
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, '0');
  const minutes = (totalMinutes % 60).toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}

function tryExtractDateText(rows: unknown[][]): string | null {
  for (const row of rows.slice(0, 6)) {
    for (const cell of row) {
      if (typeof cell !== 'string') continue;
      const match = cell.match(/\b\d{2}\.\d{2}\.\d{4}\b/);
      if (match) {
        return match[0];
      }
    }
  }

  return null;
}

function isHeaderMarker(
  value: unknown,
  marker: 'date' | 'unit' | 'norm',
): boolean {
  if (typeof value !== 'string') return false;

  const normalized = value.replace(/\s+/g, ' ').trim().toLowerCase();

  if (marker === 'date') {
    return normalized === 'дата' || normalized.includes(' date');
  }

  if (marker === 'unit') {
    return (
      normalized === 'ед.измер.' ||
      normalized === 'ед. измер.' ||
      normalized === 'ед изм' ||
      normalized === 'единица измерения'
    );
  }

  return normalized === 'норма';
}

function findStructuredHeaderRow(rows: unknown[][]): {
  headerRowIndex: number;
  dateColumnIndex: number;
} | null {
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex];
    const dateColumnIndex = row.findIndex((cell) =>
      isHeaderMarker(cell, 'date'),
    );
    const stringCount = row.filter(
      (cell) => typeof cell === 'string' && cell.trim(),
    ).length;

    if (dateColumnIndex >= 0 && stringCount >= 2) {
      return { headerRowIndex: rowIndex, dateColumnIndex };
    }
  }

  return null;
}

function findTimelineHeaderRow(rows: unknown[][]): number {
  return rows.findIndex((row) => {
    const firstCell =
      typeof row[0] === 'string' ? row[0].trim().toLowerCase() : '';
    const secondCell =
      typeof row[1] === 'string' ? row[1].trim().toLowerCase() : '';
    const numericCount = row.filter((cell) => typeof cell === 'number').length;

    return (
      firstCell === 'сменное время' &&
      (secondCell === 'ч' || secondCell === 'час' || secondCell === 'мин') &&
      numericCount >= 1
    );
  });
}

function findStructuredDataStart(
  rows: unknown[][],
  headerRowIndex: number,
  dateColumnIndex: number,
): number {
  for (
    let rowIndex = headerRowIndex + 1;
    rowIndex < rows.length;
    rowIndex += 1
  ) {
    const row = rows[rowIndex] ?? [];
    const dateValue = row[dateColumnIndex];
    const numericCount = row.filter(
      (value) => typeof value === 'number',
    ).length;

    const hasValidDate =
      typeof dateValue === 'number' ||
      dateValue instanceof Date ||
      (typeof dateValue === 'string' && isDateLikeString(dateValue));

    if (hasValidDate && numericCount >= 2) {
      return rowIndex;
    }
  }

  return -1;
}

function isDataStartRow(row: unknown[]): boolean {
  if (!row.length) return false;

  const firstCell = row[0];
  const numericCount = row.filter((value) => typeof value === 'number').length;

  if (typeof firstCell === 'number' || firstCell instanceof Date) {
    return true;
  }

  if (typeof firstCell === 'string' && isDateLikeString(firstCell)) {
    return true;
  }

  return numericCount >= 2;
}

function shouldMergeHeaders(rows: unknown[][]): boolean {
  if (findStructuredHeaderRow(rows)) {
    return true;
  }

  const [first = [], second = [], third = []] = rows;

  const firstHasGaps = first.some((value) => !isNonEmpty(value));
  const secondLooksLikeHeader = second[0] == null && second.some(isNonEmpty);
  const thirdLooksLikeHeader = third[0] == null && third.some(isNonEmpty);

  return firstHasGaps && (secondLooksLikeHeader || thirdLooksLikeHeader);
}

function normalizeHeaderPart(value: unknown): string | null {
  if (!isNonEmpty(value)) return null;

  if (typeof value === 'number' && value >= 0 && value < 2) {
    return formatExcelTime(value);
  }

  if (typeof value !== 'string') return null;

  return String(value).replace(/\s+/g, ' ').trim();
}

function makeUniqueHeaders(headers: string[]): string[] {
  const counts = new Map<string, number>();

  return headers.map((header, index) => {
    const base = header || `column_${index + 1}`;
    const next = (counts.get(base) ?? 0) + 1;
    counts.set(base, next);

    return next === 1 ? base : `${base} (${next})`;
  });
}

function buildMergedHeaders(headerRows: unknown[][]): string[] {
  const normalizedRows = headerRows.map((row) => {
    const isUnitRow = row.some((cell) => isHeaderMarker(cell, 'unit'));
    const isNormRow = row.some((cell) => isHeaderMarker(cell, 'norm'));
    const mostlyNumeric =
      row.filter((cell) => typeof cell === 'number').length >
      row.filter(isNonEmpty).length / 2;
    const nonEmptyCount = row.filter(isNonEmpty).length;
    const shouldCarryGroups = nonEmptyCount >= 2;
    let currentGroup: unknown;

    return row.map((cell) => {
      if (mostlyNumeric || isNormRow) {
        return null;
      }

      if (isUnitRow && isHeaderMarker(cell, 'unit')) {
        return null;
      }

      if (isNonEmpty(cell)) {
        currentGroup = cell;
        return cell;
      }

      return shouldCarryGroups ? (currentGroup ?? null) : null;
    });
  });

  const maxColumns = Math.max(...normalizedRows.map((row) => row.length), 0);
  const headers = Array.from({ length: maxColumns }, (_, index) => {
    const parts = normalizedRows
      .map((row) => normalizeHeaderPart(row[index]))
      .filter((value): value is string => Boolean(value));

    const uniqueParts = parts.filter(
      (part, partIndex) => parts.indexOf(part) === partIndex,
    );

    return uniqueParts.join(' / ');
  });

  return makeUniqueHeaders(headers);
}

function rowsToObjects(headers: string[], rows: unknown[][]): RawRow[] {
  return rows
    .filter((row) => row.some(isNonEmpty))
    .map((row) =>
      headers.reduce<RawRow>((acc, header, index) => {
        acc[header] = row[index] ?? null;
        return acc;
      }, {}),
    );
}

function pruneEmptyColumns(rows: RawRow[]): RawRow[] {
  if (!rows.length) {
    return rows;
  }

  const headers = Object.keys(rows[0]).filter((header) =>
    rows.some((row) => isNonEmpty(row[header])),
  );

  return rows.map((row) =>
    headers.reduce<RawRow>((acc, header) => {
      acc[header] = row[header];
      return acc;
    }, {}),
  );
}

export function readWorksheetRows(file: Express.Multer.File): RawRow[] {
  const workbook = XLSX.read(file.buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: null,
    raw: true,
  });

  if (!matrix.length) {
    return [];
  }

  const timelineHeaderRowIndex = findTimelineHeaderRow(matrix);

  if (timelineHeaderRowIndex >= 0) {
    const headers = makeUniqueHeaders(
      (matrix[timelineHeaderRowIndex] ?? []).map(
        (cell, index) => normalizeHeaderPart(cell) ?? `column_${index + 1}`,
      ),
    );
    const sheetDate = tryExtractDateText(matrix);
    const rows = pruneEmptyColumns(
      rowsToObjects(headers, matrix.slice(timelineHeaderRowIndex + 1)),
    )
      .filter((row) => {
        const category = row[headers[0]];
        const unit = row[headers[1]];
        const numericCount = Object.values(row).filter(
          (value) => typeof value === 'number',
        ).length;

        return isNonEmpty(category) && (isNonEmpty(unit) || numericCount >= 2);
      })
      .map((row) =>
        sheetDate
          ? {
              ...row,
              'Дата листа': sheetDate,
            }
          : row,
      );

    return rows;
  }

  if (!shouldMergeHeaders(matrix)) {
    return XLSX.utils.sheet_to_json<RawRow>(sheet, {
      defval: null,
      raw: true,
    });
  }

  const structuredHeader = findStructuredHeaderRow(matrix);
  const structuredDataStart = structuredHeader
    ? findStructuredDataStart(
        matrix,
        structuredHeader.headerRowIndex,
        structuredHeader.dateColumnIndex,
      )
    : -1;

  const dataStart =
    structuredDataStart > 0
      ? structuredDataStart
      : matrix.findIndex(isDataStartRow);
  const headerDepth = dataStart > 0 ? dataStart : 1;
  const headers = buildMergedHeaders(matrix.slice(0, headerDepth));
  const rows = pruneEmptyColumns(
    rowsToObjects(headers, matrix.slice(headerDepth)),
  );

  if (!structuredHeader) {
    return rows;
  }

  const dateHeader = headers[structuredHeader.dateColumnIndex];

  return rows.filter((row) => {
    const dateValue = row[dateHeader];

    if (dateValue == null || dateValue === '') {
      return false;
    }

    if (typeof dateValue === 'number' || dateValue instanceof Date) {
      return true;
    }

    if (typeof dateValue === 'string') {
      return isDateLikeString(dateValue);
    }

    return false;
  });
}
