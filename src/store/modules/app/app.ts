import { getLayoutSnapshot } from '@/core/preferences/persistence/storage';
import { DEFAULT_LAYOUT, DEFAULT_SIDEBAR_OPENED } from '@/core/preferences/defaults/preference-defaults';
import { deviceDetection } from '@/shared/utils/device/deviceDetection';
import { type LayoutMode, toLayoutMode } from '@/shared/utils/layout/layout-mode';
import { defineStore } from 'pinia';
import { setSidebarOpened } from '@/core/preferences/runtime/actions';
import type { AppLayoutState } from '../../types';

export const useAppStore = defineStore('app', {
  state: (): AppLayoutState => ({
    sidebar: {
      opened: getLayoutSnapshot().sidebarStatus ?? DEFAULT_SIDEBAR_OPENED,
      withoutAnimation: false,
      isClickCollapse: false,
    },
    layout: toLayoutMode(getLayoutSnapshot().layout ?? DEFAULT_LAYOUT),
    device: deviceDetection() ? 'mobile' : 'desktop',
    viewportSize: {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    },
  }),
  getters: {
    getSidebarStatus(state) {
      return state.sidebar.opened;
    },
    getDevice(state) {
      return state.device;
    },
    getViewportWidth(state) {
      return state.viewportSize.width;
    },
    getViewportHeight(state) {
      return state.viewportSize.height;
    },
  },
  actions: {
    TOGGLE_SIDEBAR(opened?: boolean, resize?: string) {
      setSidebarOpened(opened, { resize });
    },
    async toggleSideBar(opened?: boolean, resize?: string) {
      this.TOGGLE_SIDEBAR(opened, resize);
    },
    toggleDevice(device: string) {
      this.device = device;
    },
    setLayout(layout: LayoutMode) {
      this.layout = layout;
    },
    setViewportSize(size) {
      this.viewportSize = size;
    },
  },
});
