import * as XLSX from 'xlsx';
import {
  normalizeSingleRecord,
  normalizeWideRecords,
  resolveWideModeColumns,
} from './transform';
import { readWorksheetRows } from './worksheet';

describe('archive import helpers', () => {
  it('uses value column name as category in single mode when category is omitted', () => {
    const record = normalizeSingleRecord(
      {
        Date: 46113,
        'Произведение Ме, кг': 23.5,
      },
      0,
      {
        created_at: 'Date',
        value: 'Произведение Ме, кг',
      },
      1,
    );

    expect(record.category).toBe('Произведение Ме');
    expect(record.unit).toBe('кг');
    expect(record.value).toBe(23.5);
  });

  it('expands wide rows into multiple category records', () => {
    const rows = [
      {
        Дата: 46113,
        'Металл в руде / гр': 3225,
        'Извлечение / %': 89.196,
      },
    ];

    const wideMode = resolveWideModeColumns(rows, { created_at: 'Дата' });

    expect(wideMode.enabled).toBe(true);
    expect(wideMode.valueColumns).toEqual([
      'Металл в руде / гр',
      'Извлечение / %',
    ]);

    const records = normalizeWideRecords(
      rows[0],
      0,
      { created_at: 'Дата' },
      1,
      wideMode.valueColumns,
    );

    expect(records).toHaveLength(2);
    expect(records.map((record) => record.category)).toEqual([
      'Металл в руде',
      'Извлечение',
    ]);
    expect(records.map((record) => record.unit)).toEqual(['гр', '%']);
  });

  it('merges multi-row spreadsheet headers into readable column names', () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
      ['Дата', 'Переработка', null],
      [null, '1 линия, тонн', '2 линия, тонн'],
      [46113, 100, 200],
    ]);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const rows = readWorksheetRows({
      buffer: XLSX.write(workbook, {
        type: 'buffer',
        bookType: 'xlsx',
      }) as Buffer,
    } as Express.Multer.File);

    expect(rows[0]).toEqual({
      Дата: 46113,
      'Переработка / 1 линия, тонн': 100,
      'Переработка / 2 линия, тонн': 200,
    });
  });

  it('supports equipment summary layout with row categories and sheet date', () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
      [null, null, null],
      ['1 смена 31.12.2025', null, null],
      [null, null, null],
      ['Сменное время', 'ч', 0.75, 'Время работы'],
      ['ДСК', 'мин', 0.0416666667, 0],
      ['Вибропитатель', 'мин', 0, 0.5],
    ]);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const rows = readWorksheetRows({
      buffer: XLSX.write(workbook, {
        type: 'buffer',
        bookType: 'xlsx',
      }) as Buffer,
    } as Express.Multer.File);

    expect(Object.keys(rows[0])).toContain('Дата листа');
    expect(rows[0]['Сменное время']).toBe('ДСК');
    expect(rows[0]['ч']).toBe('мин');
    expect(rows[0]['18:00']).toBeCloseTo(0.0416666667);
  });
});
