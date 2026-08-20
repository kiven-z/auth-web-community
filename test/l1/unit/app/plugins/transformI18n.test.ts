import { beforeEach, describe, expect, it } from 'vitest';
import { isRef } from 'vue';
import { i18n, transformI18n } from '@/app/plugins/i18n';

function setLocale(locale: string) {
  const current = i18n.global.locale;
  if (isRef(current)) {
    current.value = locale;
  } else {
    i18n.global.locale = locale as typeof i18n.global.locale;
  }
}

describe('transformI18n', () => {
  beforeEach(() => {
    setLocale('zh');
  });

  it.each([
    ['', ''],
    [null, ''],
    [undefined, ''],
  ] as const)('returns empty string for %p', (input, expected) => {
    expect(transformI18n(input)).toBe(expected);
  });

  it('resolves locale map by current locale', () => {
    const map = { zh: '首页', en: 'Home' };
    expect(transformI18n(map)).toBe('首页');

    setLocale('en');
    expect(transformI18n(map)).toBe('Home');
  });

  it('returns empty string when locale map misses current locale', () => {
    expect(transformI18n({ en: 'Home' })).toBe('');
  });

  it('translates nested i18n key when catalog contains it', () => {
    expect(transformI18n('menus.home')).toBe('首页');

    setLocale('en');
    expect(transformI18n('menus.home')).toBe('Home');
  });

  it('returns original string when key is missing', () => {
    expect(transformI18n('not.a.real.key')).toBe('not.a.real.key');
  });
});
