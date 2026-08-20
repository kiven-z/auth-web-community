import { describe, expect, it } from 'vitest';
import { parseContentDispositionFilename } from '@/shared/utils/file/download';

describe('parseContentDispositionFilename', () => {
  it('parses UTF-8 filename* parameter', () => {
    const header =
      'attachment; filename="file-records_20260811143022.zip"; filename*=UTF-8\'\'file-records_20260811143022.zip';
    expect(parseContentDispositionFilename(header)).toBe('file-records_20260811143022.zip');
  });

  it('parses quoted filename parameter', () => {
    expect(parseContentDispositionFilename('attachment; filename="report.xlsx"')).toBe('report.xlsx');
  });

  it('returns undefined for empty header', () => {
    expect(parseContentDispositionFilename(undefined)).toBeUndefined();
    expect(parseContentDispositionFilename('')).toBeUndefined();
  });
});
