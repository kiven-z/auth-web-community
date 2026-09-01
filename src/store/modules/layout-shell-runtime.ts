import { LAYOUT_DEFAULT_MODE } from '@/core/config/ui-config';
import { deviceDetection } from '@/shared/utils/device/device-detection';
import { type LayoutMode, toLayoutMode } from '@/shared/utils/layout/layout-mode';
import { defineStore } from 'pinia';

/** 布局壳运行时（不持久化：生效布局、侧栏动画、视口、设置抽屉、内容全屏） */
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
  /** 右侧系统设置面板是否打开 */
  settingsPanelOpen: boolean;
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
    layout: toLayoutMode(LAYOUT_DEFAULT_MODE),
    device: deviceDetection() ? 'mobile' : 'desktop',
    viewportSize: {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    },
    settingsPanelOpen: false,
    hiddenSideBar: false,
  }),
});
