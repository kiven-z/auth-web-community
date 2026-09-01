import { LAYOUT_DEFAULT_MODE } from '@/core/config/ui-config';
import { type LayoutMode, toLayoutMode } from '@/shared/utils/layout/layout-mode';
import { useLayoutShellRuntimeStore } from '@/store/modules/layout-shell-runtime';
import { useLayoutPreferencesStore } from '@/store/modules/preferences/layout-preferences';
import { ref } from 'vue';

/** 视口响应式布局覆盖（不写入偏好 storage，不触发服务端同步） */
export const runtimeLayoutOverride = ref<LayoutMode | null>(null);

/**
 * 当前生效的布局模式（运行时覆盖优先于用户偏好）
 * @param preferredLayout 用户偏好中的布局
 * @returns 当前应展示的布局模式
 */
export function resolveEffectiveLayout(preferredLayout?: string): LayoutMode {
  return runtimeLayoutOverride.value ?? toLayoutMode(preferredLayout ?? LAYOUT_DEFAULT_MODE);
}

/**
 * 将生效布局同步到 body 与布局壳运行时（偏好变更 / 运行时覆盖共用）
 * @param preferredLayout 用户偏好中的布局；省略时读 Pinia
 */
export function applyEffectiveLayoutToShell(preferredLayout?: string): void {
  const preferred = preferredLayout ?? useLayoutPreferencesStore().layout;
  const effectiveLayout = resolveEffectiveLayout(preferred);
  globalThis.document.body.setAttribute('layout', effectiveLayout);
  useLayoutShellRuntimeStore().layout = effectiveLayout;
}

/**
 * 设置或清除运行时布局覆盖，并应用到 body / 布局壳运行时
 * @param layoutModel 覆盖值；传 null 清除并恢复用户偏好
 */
export function setRuntimeLayoutOverride(layoutModel: LayoutMode | null): void {
  if (runtimeLayoutOverride.value === layoutModel) {
    return;
  }
  runtimeLayoutOverride.value = layoutModel;
  applyEffectiveLayoutToShell();
}
