import { describe, expect, it } from 'vitest';
import { toStableKey } from '@/shared/utils/string/to-stable-key';

describe('toStableKey', () => {
  it.each([
    ['hello', 'hello'],
    [0, '0'],
    [42, '42'],
    [true, 'true'],
    [false, 'false'],
  ] as const)('stringifies scalar %p', (input, expected) => {
    expect(toStableKey(input)).toBe(expected);
  });

  it.each([null, undefined, {}, [], { id: 1 }, Symbol('x'), () => 1] as const)(
    'returns empty string for non-scalar %p',
    (input) => {
      expect(toStableKey(input)).toBe('');
    }
  );
});
