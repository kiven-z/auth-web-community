import { describe, expect, it } from 'vitest';
import { buildExportFilenameStamp } from '@/shared/utils/date/dateTime';

describe('buildExportFilenameStamp', () => {
  it('formats instant in UTC regardless of local timezone', () => {
    const stamp = buildExportFilenameStamp('2026-08-11T14:30:22.000Z');
    expect(stamp).toBe('20260811143022');
  });

  it('uses current UTC time when input is omitted', () => {
    const now = new Date();
    const expected = [
      now.getUTCFullYear(),
      String(now.getUTCMonth() + 1).padStart(2, '0'),
      String(now.getUTCDate()).padStart(2, '0'),
      String(now.getUTCHours()).padStart(2, '0'),
      String(now.getUTCMinutes()).padStart(2, '0'),
      String(now.getUTCSeconds()).padStart(2, '0'),
    ].join('');

    expect(buildExportFilenameStamp()).toBe(expected);
  });
});
