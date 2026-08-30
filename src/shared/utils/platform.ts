/**
 * 品牌 Logo 资源地址（侧栏 / 顶栏 / 登录页）
 * @returns logo URL
 */
export function getLogoUrl(): string {
  return new URL('/logo.svg', import.meta.url).href;
}

/**
 * 布局内 el-tooltip / tippy 的 effect（随 html.dark）
 * @returns light | dark
 */
export function getMenuTooltipEffect(): 'light' | 'dark' {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}
