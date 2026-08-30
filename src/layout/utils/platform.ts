import { getConfig } from '@/auth/config';

/**
 * 应用标题（部署配置 Title）
 * @returns 标题文案
 */
export function getAppTitle(): string {
  return getConfig()?.Title ?? '';
}

/**
 * 品牌 Logo 资源地址（侧栏 / 顶栏 / 登录页）
 * @returns logo URL
 */
export function getLogoUrl(): string {
  return new URL('/logo.svg', import.meta.url).href;
}

/**
 * 布局内 el-tooltip / tippy 的 effect
 * @returns light | dark 等配置值，默认 light
 */
export function getMenuTooltipEffect(): string {
  return getConfig()?.TooltipEffect ?? 'light';
}
