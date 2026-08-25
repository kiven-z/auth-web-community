import { useAppStore } from '@/store/modules/app/app';
import { ref, type Ref } from 'vue';
import { type LayoutMode, toLayoutMode } from '@/shared/utils/layout/layout-mode';
import { DEFAULT_LAYOUT } from './preference-defaults';
import { getLayoutSnapshot } from '../persistence/storage';

/** 视口响应式布局覆盖（不写入偏好 storage，不触发服务端同步） */
const runtimeLayoutOverride = ref<LayoutMode | null>(null);

/**
 * 当前生效的布局模式（运行时覆盖优先于用户偏好）
 * @returns 布局模式
 */
function getEffectiveLayoutModel(): LayoutMode {
  return runtimeLayoutOverride.value ?? toLayoutMode(getLayoutSnapshot().layout ?? DEFAULT_LAYOUT);
}

/**
 * 有效布局模式：运行时覆盖优先，否则用偏好中的布局
 * @param preferredLayout 用户偏好中的布局
 * @returns 当前应展示的布局模式
 */
export function resolveEffectiveLayout(preferredLayout?: string): LayoutMode {
  return runtimeLayoutOverride.value ?? toLayoutMode(preferredLayout ?? DEFAULT_LAYOUT);
}

/**
 * 供 Vue computed 订阅的运行时覆盖 ref
 * @returns 覆盖 ref
 */
export function getRuntimeLayoutOverrideRef(): Ref<LayoutMode | null> {
  return runtimeLayoutOverride;
}

/**
 * 设置或清除运行时布局覆盖，并应用到 body / app store
 * @param layoutModel 覆盖值；传 null 清除并恢复用户偏好
 */
export function setRuntimeLayoutOverride(layoutModel: LayoutMode | null): void {
  if (runtimeLayoutOverride.value === layoutModel) {
    return;
  }
  runtimeLayoutOverride.value = layoutModel;
  const effectiveLayout = getEffectiveLayoutModel();
  globalThis.document.body.setAttribute('layout', effectiveLayout);
  useAppStore().setLayout(effectiveLayout);
}
