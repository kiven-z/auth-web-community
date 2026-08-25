import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { resolvePrimaryColorForNavTheme } from '@/core/preferences/defaults/nav-theme-colors';
import {
  DEFAULT_NAV_THEME,
  DEFAULT_PRIMARY_COLOR,
  resolveEffectiveNavTheme,
} from '@/core/preferences/runtime/theme-defaults';
import { buildPrimaryColorInlineStyle, PRIMARY_COLOR_INLINE_VARS } from '@/shared/utils/color/primaryColorInline';

describe('resolveEffectiveNavTheme', () => {
  it('暗色下将白侧栏回落到 default，且不依赖其它皮肤', () => {
    expect(resolveEffectiveNavTheme('light', true)).toBe('default');
    expect(resolveEffectiveNavTheme('dusk', true)).toBe('dusk');
  });

  it('浅色下保留用户选择的白侧栏', () => {
    expect(resolveEffectiveNavTheme('light', false)).toBe('light');
    expect(resolveEffectiveNavTheme(undefined, false)).toBe(DEFAULT_NAV_THEME);
  });
});

describe('resolvePrimaryColorForNavTheme', () => {
  it('白侧栏 / default 均重置为默认主色', () => {
    expect(resolvePrimaryColorForNavTheme('light')).toBe(DEFAULT_PRIMARY_COLOR);
    expect(resolvePrimaryColorForNavTheme('default')).toBe(DEFAULT_PRIMARY_COLOR);
  });

  it('彩色皮肤写入对应预览色', () => {
    expect(resolvePrimaryColorForNavTheme('dusk')).toBe('#f5222d');
  });
});

describe('品牌主色双写', () => {
  it('color.scss --auth-color-brand-6 与 DEFAULT_PRIMARY_COLOR 一致', () => {
    const scssPath = resolve(process.cwd(), 'src/style/tokens/color.scss');
    const source = readFileSync(scssPath, 'utf8');
    const matched = source.match(/--auth-color-brand-6:\s*([^;]+);/);
    expect(matched?.[1]?.trim().toLowerCase()).toBe(DEFAULT_PRIMARY_COLOR.toLowerCase());
  });
});

describe('运行时主色内联（色阶单轨）', () => {
  it('只写 brand-6 / brand / primary，不含 EP light/dark 阶', () => {
    expect([...PRIMARY_COLOR_INLINE_VARS]).toEqual([
      '--auth-color-brand-6',
      '--auth-color-brand',
      '--el-color-primary',
    ]);
    const style = buildPrimaryColorInlineStyle('#f5222d');
    expect(Object.keys(style)).toEqual([...PRIMARY_COLOR_INLINE_VARS]);
    expect(style['--auth-color-brand-6']).toBe('#f5222d');
    expect(style['--el-color-primary']).toBe('#f5222d');
    expect(Object.keys(style).some((key) => key.includes('light') || key.includes('dark'))).toBe(false);
  });

  it('map-element 仍将 EP 主色阶映射到 auth brand', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/style/map-element.scss'), 'utf8');
    expect(source).toContain('--el-color-primary-light-9: var(--auth-color-brand-1)');
    expect(source).toContain('--el-color-primary-dark-2: var(--auth-color-brand-7)');
  });

  it('map-element 暗色覆盖 info/fill soft，避免挂亮色 gray-1', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/style/map-element.scss'), 'utf8');
    expect(source).toMatch(/html\.dark\s*\{[\s\S]*--el-color-info-light-9:\s*var\(--auth-color-gray-13\)/);
    expect(source).toMatch(/html\.dark\s*\{[\s\S]*--el-fill-color-lighter:\s*var\(--auth-bg-container-hover\)/);
  });
});
