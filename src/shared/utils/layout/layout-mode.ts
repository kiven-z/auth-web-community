/** 导航布局模式（写入偏好 / body[layout]） */
export type LayoutMode = 'vertical' | 'horizontal' | 'mix';

/** 合法布局模式集合 */
export const LAYOUT_MODES = ['vertical', 'horizontal', 'mix'] as const;

/** 出厂默认布局模式 */
export const DEFAULT_LAYOUT_MODE: LayoutMode = 'vertical';

/** 由布局模式派生的壳层展示能力（不含 device） */
export interface LayoutCapabilities {
  /** 当前模式 */
  mode: LayoutMode;
  /** 是否渲染侧栏（vertical / mix） */
  showSideNav: boolean;
  /** 是否渲染顶栏水平菜单（horizontal） */
  showHorizontalNav: boolean;
  /** 是否渲染 mix 顶栏一级菜单 */
  showMixTopMenu: boolean;
  /** 顶栏是否展示面包屑（非 mix；调用方再叠 mobile） */
  showNavbarBreadcrumb: boolean;
  /** 顶栏是否展示工具区（vertical） */
  showNavbarToolbar: boolean;
  /** 侧栏是否吃 mix 二级菜单（调用方再叠 mobile） */
  useMixSideMenu: boolean;
  /** 移动端遮罩是否跟侧栏联动（vertical） */
  mobileMaskUsesSideNav: boolean;
}

/**
 * 是否为合法布局模式
 * @param value 待判定值
 */
export function isLayoutMode(value: unknown): value is LayoutMode {
  return typeof value === 'string' && (LAYOUT_MODES as readonly string[]).includes(value);
}

/**
 * 将任意值收成 LayoutMode；非法时回落默认
 * @param value 原始布局值
 * @returns 合法布局模式
 */
export function toLayoutMode(value: unknown): LayoutMode {
  return isLayoutMode(value) ? value : DEFAULT_LAYOUT_MODE;
}

/**
 * 由布局模式解析壳层展示能力
 * @param mode 布局模式
 * @returns 展示能力
 */
export function resolveLayoutCapabilities(mode: LayoutMode): LayoutCapabilities {
  const isVertical = mode === 'vertical';
  const isHorizontal = mode === 'horizontal';
  const isMix = mode === 'mix';

  return {
    mode,
    showSideNav: isVertical || isMix,
    showHorizontalNav: isHorizontal,
    showMixTopMenu: isMix,
    showNavbarBreadcrumb: !isMix,
    showNavbarToolbar: isVertical,
    useMixSideMenu: isMix,
    mobileMaskUsesSideNav: isVertical,
  };
}
