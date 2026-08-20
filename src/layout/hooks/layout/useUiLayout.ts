import { setRuntimeLayoutOverride } from '@/core/preferences/defaults/runtime-layout';
import { getLayoutSnapshot, patchLayout } from '@/core/preferences/persistence/storage';
import { applyLayoutPreferences } from '@/core/preferences/runtime/apply';
import { useLayout } from '@/layout/hooks/layout/useLayout';
import { type LayoutMode, toLayoutMode } from '@/shared/utils/layout/layout-mode';
import { useAppStore } from '@/store/modules/app/app';

/**
 * 设置导航布局模式（vertical / horizontal / mix）
 * @param layoutModel 布局模式
 */
function setLayoutMode(layoutModel: LayoutMode): void {
  useAppStore().sidebar.withoutAnimation = false;
  patchLayout({ layout: layoutModel });
  applyLayoutPreferences();
}

/**
 * 响应式容器宽度变化时覆盖布局展示（不写偏好 storage，不同步服务端）
 * @param layoutModel 当前视口应展示的布局
 */
function setResponsiveLayoutTheme(layoutModel: string): void {
  const preferredLayout = toLayoutMode(getLayoutSnapshot().layout);
  const nextLayout = toLayoutMode(layoutModel);
  setRuntimeLayoutOverride(nextLayout === preferredLayout ? null : nextLayout);
}

/**
 * UI 布局模式与侧栏状态写入（经 preferences storage 网关）
 * @returns 布局读写与响应式覆盖
 */
export function useUiLayout() {
  const { layoutTheme, layout } = useLayout();

  return {
    layout,
    layoutTheme,
    setLayoutMode,
    setResponsiveLayoutTheme,
  };
}
