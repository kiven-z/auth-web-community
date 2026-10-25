import { APP_CONFIG, DEFAULT_LOCALE } from '@/core/config/app-config';
import { routerArrays } from '@/router/types';
import { useLayoutShellRuntimeStore } from '@/store/modules/layout-shell-runtime';
import { useDisplayPreferencesStore } from '@/store/modules/preferences/display-preferences';
import { useLayoutPreferencesStore } from '@/store/modules/preferences/layout-preferences';
import { useLocalePreferencesStore } from '@/store/modules/preferences/locale-preferences';
import { useTagsPreferencesStore } from '@/store/modules/preferences/tags/tags-preferences';
import { useThemePreferencesStore } from '@/store/modules/preferences/theme-preferences';
import { applyHydratedUiPreferences } from './apply';

/** 侧栏展开状态写入选项 */
interface SetSidebarOpenedOptions {
  withoutAnimation?: boolean;
  resize?: string;
}

/** resize 结束后恢复壳动画的防抖句柄 */
let clearWithoutAnimationTimer: ReturnType<typeof setTimeout> | undefined;

/**
 * 更新侧栏展开状态；用户操作会持久化，视口 resize 仅改运行时 store
 * @param opened 是否展开；省略时切换当前状态
 * @param options withoutAnimation、resize
 */
export function setSidebarOpened(opened?: boolean, options?: SetSidebarOpenedOptions): void {
  const resize = options?.resize;
  const layoutShellStore = useLayoutShellRuntimeStore();
  const layoutStore = useLayoutPreferencesStore();

  // 视口断点适配：只改运行时侧栏，不写入偏好
  if (resize) {
    layoutShellStore.sidebar.withoutAnimation = true;
    layoutShellStore.sidebar.opened = Boolean(opened);
    if (clearWithoutAnimationTimer !== undefined) {
      clearTimeout(clearWithoutAnimationTimer);
    }
    clearWithoutAnimationTimer = setTimeout(() => {
      layoutShellStore.sidebar.withoutAnimation = false;
      clearWithoutAnimationTimer = undefined;
    }, 180);
    return;
  }

  if (clearWithoutAnimationTimer !== undefined) {
    clearTimeout(clearWithoutAnimationTimer);
    clearWithoutAnimationTimer = undefined;
  }

  // 未传参：用户点击切换
  if (opened === undefined) {
    layoutShellStore.sidebar.withoutAnimation = false;
    layoutShellStore.sidebar.opened = !layoutShellStore.sidebar.opened;
    layoutShellStore.sidebar.isClickCollapse = !layoutShellStore.sidebar.opened;
    layoutStore.setSidebarStatus(layoutShellStore.sidebar.opened);
    return;
  }

  // 显式 true / false：直接设置并持久化
  layoutShellStore.sidebar.withoutAnimation = false;
  layoutShellStore.sidebar.opened = opened;
  layoutStore.setSidebarStatus(opened);
}

/** 重置界面偏好到出厂值并写入本机，页签回到首页 */
export function resetAppearancePreferences(): void {
  useLocalePreferencesStore().$patch({ locale: DEFAULT_LOCALE });
  useThemePreferencesStore().$patch({
    colorScheme: APP_CONFIG.theme.colorScheme,
    navTheme: APP_CONFIG.theme.navTheme,
    primaryColor: APP_CONFIG.theme.primaryColor,
  });
  useLayoutPreferencesStore().$patch({
    layout: APP_CONFIG.layout.mode,
    sidebarStatus: true,
  });
  useDisplayPreferencesStore().$patch({
    weak: false,
    hideFooter: true,
  });
  useTagsPreferencesStore().$patch({
    multiTags: [...routerArrays],
    hasSavedTags: false,
  });
  applyHydratedUiPreferences();
}
