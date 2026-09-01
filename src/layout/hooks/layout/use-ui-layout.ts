import { setRuntimeLayoutOverride } from '@/core/preferences/runtime/layout-override';
import { useLayoutPreferencesStore } from '@/store/modules/preferences/layout-preferences';
import { toLayoutMode } from '@/shared/utils/layout/layout-mode';

/**
 * 视口宽度变化时覆盖布局展示（不写偏好，不同步服务端）
 * @param layoutModel 当前视口应展示的布局
 */
export function setViewportLayoutOverride(layoutModel: string): void {
  const preferredLayout = toLayoutMode(useLayoutPreferencesStore().layout);
  const nextLayout = toLayoutMode(layoutModel);
  setRuntimeLayoutOverride(nextLayout === preferredLayout ? null : nextLayout);
}
