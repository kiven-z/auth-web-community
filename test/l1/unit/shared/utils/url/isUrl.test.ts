import { describe, expect, it } from 'vitest';
import { isUrl } from '@/shared/utils/url/url';

describe('isUrl', () => {
  it.each([
    ['https://example.com', true],
    ['http://localhost:8080/path?q=1', true],
    ['ftp://files.example.com', true],
    ['ws://localhost:3000', true],
    ['wss://socket.example.com/events', true],
    ['https://user:pass@host.com', true],
    ['https://www.baidu.com/s?wd=test', true],
    ['example.com', true],
    ['baidu.com', true],
    ['www.example.org', true],
    ['192.168.1.1', true],
    ['127.0.0.1', true],
    ['localhost', true],
    ['localhost:5173', true],
  ])('accepts URL-like value %s', (value, expected) => {
    expect(isUrl(value)).toBe(expected);
  });

  it.each([
    ['', false],
    ['not a url', false],
    ['/relative/path', false],
    ['javascript:alert(1)', false],
    ['x', false],
    ['a.b', false],
  ])('rejects non-URL value %s', (value, expected) => {
    expect(isUrl(value)).toBe(expected);
  });
});
