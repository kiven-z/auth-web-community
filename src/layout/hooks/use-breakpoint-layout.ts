import { setSidebarOpened } from '@/core/preferences/runtime/actions';
import { useLayoutPreferencesStore } from '@/store/modules/preferences/layout-preferences';
import { setViewportLayoutOverride } from '@/layout/hooks/layout/use-ui-layout';
import { useLayoutShellRuntimeStore } from '@/store/modules/layout-shell-runtime';
import { deviceDetection } from '@/shared/utils/device/device-detection';
import { LAYOUT_DEFAULT_MODE } from '@/core/config/ui-config';
import { toLayoutMode } from '@/shared/utils/layout/layout-mode';
import { useResizeObserver } from '@vueuse/core';
import { onMounted, type Ref } from 'vue';

/** 窄屏阈值：侧栏隐藏并视为 mobile */
const VIEWPORT_MOBILE_MAX = 760;
/** 中屏上限：侧栏折叠 */
const VIEWPORT_TABLET_MAX = 990;

/**
 * 布局壳断点：按容器宽度切换 device / 侧栏，并窄屏运行时覆盖为 vertical（不写回偏好）
 * @param appWrapperRef 布局根容器
 */
export function useBreakpointLayout(appWrapperRef: Ref<HTMLDivElement | undefined>): void {
  const layoutShellStore = useLayoutShellRuntimeStore();
  const isMobileUa = deviceDetection();

  /** 是否允许在加宽时自动展开侧栏 */
  let isAutoCloseSidebar = true;

  /**
   * 同步设备类型与侧栏开合
   * @param device 设备类型
   * @param sidebarOpened 侧栏是否展开
   */
  function syncDeviceSidebar(device: string, sidebarOpened: boolean): void {
    layoutShellStore.device = device;
    setSidebarOpened(sidebarOpened, { resize: 'resize' });
  }

  useResizeObserver(appWrapperRef, (entries) => {
    if (isMobileUa) return;
    const entry = entries[0];
    const [{ inlineSize: width, blockSize: height }] = entry.borderBoxSize;
    layoutShellStore.viewportSize = { width, height };

    const preferredLayout = toLayoutMode(useLayoutPreferencesStore().layout ?? layoutShellStore.layout);
    if (width <= VIEWPORT_MOBILE_MAX) {
      setViewportLayoutOverride(LAYOUT_DEFAULT_MODE);
    } else {
      setViewportLayoutOverride(preferredLayout);
    }

    if (width > 0 && width <= VIEWPORT_MOBILE_MAX) {
      syncDeviceSidebar('mobile', false);
      isAutoCloseSidebar = true;
      return;
    }

    if (width > VIEWPORT_MOBILE_MAX && width <= VIEWPORT_TABLET_MAX) {
      if (isAutoCloseSidebar) {
        syncDeviceSidebar('desktop', false);
        isAutoCloseSidebar = false;
      }
      return;
    }

    if (width > VIEWPORT_TABLET_MAX && !layoutShellStore.sidebar.isClickCollapse) {
      syncDeviceSidebar('desktop', true);
      isAutoCloseSidebar = true;
      return;
    }

    syncDeviceSidebar('desktop', false);
    isAutoCloseSidebar = false;
  });

  onMounted(() => {
    if (isMobileUa) {
      syncDeviceSidebar('mobile', false);
    }
  });
}
