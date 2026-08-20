import { patchLayout } from '../persistence/storage';
import { useAppStore } from '@/store/modules/app/app';
import { useMultiTagsStore } from '@/store/modules/app/multiTags';
import { useUserStore } from '@/store/modules/auth/user';
import { storageLocal } from '@/core/storage/storageLocal';
import { toggleClass } from '@/shared/utils/dom/className';
import { applyThemePreferences } from './apply';
import {
  createDefaultConfigure,
  createDefaultLayout,
  DEFAULT_LAYOUT,
  DEFAULT_MULTI_TAGS_CACHE,
} from '../defaults/preference-defaults';

/** 侧栏展开状态写入选项 */
export interface SetSidebarOpenedOptions {
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
  const appStore = useAppStore();

  // 视口断点适配：只改运行时侧栏，不写入偏好、不同步服务端
  if (resize) {
    appStore.sidebar.withoutAnimation = true;
    appStore.sidebar.opened = Boolean(opened);
    if (clearWithoutAnimationTimer !== undefined) {
      clearTimeout(clearWithoutAnimationTimer);
    }
    clearWithoutAnimationTimer = setTimeout(() => {
      appStore.sidebar.withoutAnimation = false;
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
    appStore.sidebar.withoutAnimation = false;
    appStore.sidebar.opened = !appStore.sidebar.opened;
    appStore.sidebar.isClickCollapse = !appStore.sidebar.opened;
    patchLayout({ sidebarStatus: appStore.sidebar.opened });
    return;
  }

  // 显式 true / false：直接设置并持久化
  appStore.sidebar.withoutAnimation = false;
  appStore.sidebar.opened = opened;
  patchLayout({ sidebarStatus: opened });
}

/**
 * 清空 UI 偏好内存态、本地会话相关缓存并返回登录
 */
export async function resetUiPreferences(): Promise<void> {
  storageLocal().clear();
  const layout = createDefaultLayout();
  const configure = createDefaultConfigure();
  useAppStore().setLayout(DEFAULT_LAYOUT);
  patchLayout(layout);
  applyThemePreferences();
  useMultiTagsStore().multiTagsCacheChange(DEFAULT_MULTI_TAGS_CACHE);
  toggleClass(Boolean(configure.grey), 'html-grey', document.querySelector('html'));
  toggleClass(Boolean(configure.weak), 'html-weakness', document.querySelector('html'));
  await useUserStore().clearLocalSession();
}
