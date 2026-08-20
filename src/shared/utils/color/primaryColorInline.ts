/**
 * 运行时换色仅内联这些变量。
 * `--auth-color-brand-1..5/7..10` 由 `tokens/color.scss` 的 color-mix 派生；
 * `--el-color-primary-light/dark-*` 由 `map-element.scss` 映射，禁止再在 JS 里 RGB 插值覆盖。
 */
export const PRIMARY_COLOR_INLINE_VARS = ['--auth-color-brand-6', '--auth-color-brand', '--el-color-primary'] as const;

export type PrimaryColorInlineVar = (typeof PRIMARY_COLOR_INLINE_VARS)[number];

/**
 * 组装主色内联样式表（仅主色三键）
 * @param color `#RRGGBB` 主色
 * @returns 待写入 documentElement 的变量
 */
export function buildPrimaryColorInlineStyle(color: string): Record<PrimaryColorInlineVar, string> {
  return {
    '--auth-color-brand-6': color,
    '--auth-color-brand': color,
    '--el-color-primary': color,
  };
}
