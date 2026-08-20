import type { Ref } from 'vue';
import { computed, nextTick, watch } from 'vue';

import {
  DEFAULT_ADAPTIVE_DEBOUNCE_MS,
  DEFAULT_ADAPTIVE_OFFSET_BOTTOM,
  MIN_ADAPTIVE_TABLE_HEIGHT_PX,
} from '../constants';
import type { DataTableAdaptiveConfig, DataTableAdaptiveMode } from '../types';
import { useAdaptiveFillHeight } from './useAdaptiveFillHeight';
import { useFillParentHeight } from './useFillParentHeight';

/** {@link useTableHeight} 配置 */
export interface UseTableHeightOptions {
  rootRef: Ref<HTMLElement | null>;
  tableWrapperRef: Ref<HTMLElement | null>;
  adaptive: () => DataTableAdaptiveMode;
  adaptiveConfig: () => DataTableAdaptiveConfig | undefined;
  /** fill 后回调（如 ElTable.doLayout） */
  onAfterLayout?: () => void;
}

/**
 * 统一表格高度：viewport 定根高 + 表体吃满父级剩余；fill 只吃满父级
 */
export function useTableHeight(options: UseTableHeightOptions) {
  const isViewport = computed(() => options.adaptive() === 'viewport');
  const isFill = computed(() => options.adaptive() === 'fill');
  const hasAdaptiveHeight = computed(() => isViewport.value || isFill.value);

  const getDebounceMs = () => options.adaptiveConfig()?.debounceMs ?? DEFAULT_ADAPTIVE_DEBOUNCE_MS;

  const { recalculate: recalculateViewport } = useAdaptiveFillHeight(options.rootRef, {
    enabled: () => isViewport.value,
    offsetBottom: () => options.adaptiveConfig()?.offsetBottom ?? DEFAULT_ADAPTIVE_OFFSET_BOTTOM,
    reserveBottom: () => 0,
    minHeight: () => options.adaptiveConfig()?.minHeight ?? MIN_ADAPTIVE_TABLE_HEIGHT_PX,
    debounceMs: getDebounceMs,
  });

  const { recalculate: recalculateFill } = useFillParentHeight(options.tableWrapperRef, {
    enabled: () => hasAdaptiveHeight.value,
    debounceMs: getDebounceMs,
    observe: [options.rootRef],
  });

  /**
   * 按当前高度模式重算（全屏切换等）
   */
  async function setAdaptive() {
    if (isViewport.value) {
      await recalculateViewport();
    }
    if (hasAdaptiveHeight.value) {
      await recalculateFill();
      await nextTick();
      options.onAfterLayout?.();
    }
  }

  watch(
    () => options.adaptive(),
    () => {
      void setAdaptive();
    }
  );

  return {
    isViewport,
    isFill,
    hasAdaptiveHeight,
    setAdaptive,
  };
}
