import { describe, expect, it } from 'vitest';
import {
  fromEditRows,
  parseRequireFieldsJson,
  toEditRows,
} from '@/features/message/_shared/utils/require-fields-codec';

describe('toEditRows / fromEditRows', () => {
  it('roundtrips contract rows through the table editor shape', () => {
    const apiRows = [
      { key: 'code', description: '验证码', exampleValue: '123456' },
      { key: 'items', exampleValue: ['x', 'y'] },
      { key: 'meta', exampleValue: { count: 2 } },
    ];
    const edited = toEditRows(apiRows);
    expect(edited[0].uid).toBe(1);
    expect(edited[0].exampleValue).toBe('123456');
    expect(edited[1].exampleValue).toBe('["x","y"]');
    expect(edited[2].exampleValue).toBe('{"count":2}');

    const back = fromEditRows(edited);
    expect(back).toEqual([
      { key: 'code', description: '验证码', exampleValue: 123456 },
      { key: 'items', description: undefined, exampleValue: ['x', 'y'] },
      { key: 'meta', description: undefined, exampleValue: { count: 2 } },
    ]);
  });

  it('parses JSON literals from cell text via fromEditRows', () => {
    const back = fromEditRows([
      { uid: 1, key: 'n', exampleValue: '123' },
      { uid: 2, key: 'b', exampleValue: 'true' },
      { uid: 3, key: 'plain', exampleValue: 'hello' },
    ]);
    expect(back.map((row) => row.exampleValue)).toEqual([123, true, 'hello']);
  });
});

describe('parseRequireFieldsJson', () => {
  it('parses a valid array payload', () => {
    const text = JSON.stringify([{ key: 'code', exampleValue: '1' }], null, 2);
    const parsed = parseRequireFieldsJson(text);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.rows).toHaveLength(1);
      expect(parsed.rows[0].key).toBe('code');
    }
  });

  it('rejects non-array or invalid JSON', () => {
    expect(parseRequireFieldsJson('{bad').ok).toBe(false);
    expect(parseRequireFieldsJson('{"key":"a"}').ok).toBe(false);
    expect(parseRequireFieldsJson('[1]').ok).toBe(false);
  });
});
