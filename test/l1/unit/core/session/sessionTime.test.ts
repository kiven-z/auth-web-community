import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  formatMillisTimestamp,
  resolveSessionExpires,
  toExpiresTimestamp,
} from '@/core/session/sessionTime';

describe('formatMillisTimestamp', () => {
  it('returns dash for invalid values', () => {
    expect(formatMillisTimestamp(null)).toBe('-');
    expect(formatMillisTimestamp(undefined)).toBe('-');
    expect(formatMillisTimestamp(0)).toBe('-');
    expect(formatMillisTimestamp(-1)).toBe('-');
  });

  it('formats valid millis timestamp', () => {
    expect(formatMillisTimestamp(1_704_067_200_000, 'YYYY-MM-DD')).toBe('2024-01-01');
  });
});

describe('toExpiresTimestamp', () => {
  it('returns 0 for nullish input', () => {
    expect(toExpiresTimestamp(null)).toBe(0);
    expect(toExpiresTimestamp(undefined)).toBe(0);
  });

  it('returns numeric input unchanged', () => {
    expect(toExpiresTimestamp(1_704_067_200_000)).toBe(1_704_067_200_000);
  });

  it('parses ISO datetime string', () => {
    expect(toExpiresTimestamp('2026-01-01T00:00:00+08:00')).toBeGreaterThan(0);
  });

  it('returns 0 for invalid datetime string', () => {
    expect(toExpiresTimestamp('not-a-date')).toBe(0);
  });
});

describe('resolveSessionExpires', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-11T12:00:00+08:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('defaults to 8 hours from now when expires is nullish', () => {
    const expected = Date.now() + 8 * 3_600_000;
    expect(resolveSessionExpires(null)).toBe(expected);
    expect(resolveSessionExpires(undefined)).toBe(expected);
  });

  it('delegates explicit expires to toExpiresTimestamp', () => {
    expect(resolveSessionExpires(1_704_067_200_000)).toBe(1_704_067_200_000);
    expect(resolveSessionExpires('2026-01-01T00:00:00+08:00')).toBeGreaterThan(0);
  });
});
