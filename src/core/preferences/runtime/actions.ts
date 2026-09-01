import { clearMyPreferences, upsertMyPreference } from '@/features/system/api/user/user-preferences';
import { useLayoutShellRuntimeStore } from '@/store/modules/layout-shell-runtime';
import { useLayoutPreferencesStore } from '@/store/modules/preferences/layout-preferences';
import { clearDeviceUiPreferences } from '../persistence/device-storage';
import { PREFERENCE_MODULES } from '../registry';
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
 * @param options withoutAnimation、resize 与 store 行为一致
 */
export function setSidebarOpened(opened?: boolean, options?: SetSidebarOpenedOptions): void {
  const resize = options?.resize;
  const layoutShellStore = useLayoutShellRuntimeStore();
  const layoutStore = useLayoutPreferencesStore();

  // 视口断点适配：只改运行时侧栏，不写入偏好、不同步服务端
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

/**
 * 重置界面偏好：内存出厂 → 回写 Device LS → 服务端写入出厂快照
 * 服务端有键后，其他端 hydrate 可覆盖陈旧 Device LS
 */
export async function resetAppearancePreferences(): Promise<void> {
  for (const module of PREFERENCE_MODULES) {
    module.resetLocal();
  }

  clearDeviceUiPreferences();
  for (const module of PREFERENCE_MODULES) {
    module.mirrorToDevice?.();
  }

  applyHydratedUiPreferences();

  await clearMyPreferences();
  for (const module of PREFERENCE_MODULES) {
    const configValue = module.serialize();
    if (!configValue || Object.keys(configValue).length === 0) {
      continue;
    }
    await upsertMyPreference({ configKey: module.key, configValue });
  }
}
