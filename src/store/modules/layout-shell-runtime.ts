import { APP_CONFIG } from '@/core/config/app-config';
import { deviceDetection } from '@/shared/utils/device/device-detection';
import { type LayoutMode, toLayoutMode } from '@/shared/utils/layout/layout-mode';
import { defineStore } from 'pinia';

/** 布局壳运行时（不持久化：生效布局、侧栏动画、视口、内容全屏） */
interface LayoutShellRuntimeState {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
    /** 是否由用户手动点击折叠侧边栏 */
    isClickCollapse: boolean;
  };
  layout: LayoutMode;
  device: string;
  viewportSize: { width: number; height: number };
  /** 标签菜单「内容全屏」：隐藏侧栏导航 */
  hiddenSideBar: boolean;
}

export const useLayoutShellRuntimeStore = defineStore('layout-shell-runtime', {
  state: (): LayoutShellRuntimeState => ({
    sidebar: {
      opened: true,
      withoutAnimation: false,
      isClickCollapse: false,
    },
    layout: toLayoutMode(APP_CONFIG.layout.mode),
    device: deviceDetection() ? 'mobile' : 'desktop',
    viewportSize: {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    },
    hiddenSideBar: false,
  }),
});
