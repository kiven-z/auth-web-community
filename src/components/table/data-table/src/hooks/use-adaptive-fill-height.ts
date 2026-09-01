import type { Ref } from 'vue';
import { nextTick } from 'vue';

import { DEFAULT_ADAPTIVE_MIN_HEIGHT_PX, DEFAULT_ADAPTIVE_OFFSET_BOTTOM } from '../constants';
import { useHeightBinding } from './use-height-binding';

/** 自适应填满视口剩余高度的配置 */
interface AdaptiveFillHeightOptions {
  /** 是否启用，默认 true */
  enabled?: () => boolean;
  /** 距视口底部偏移 */
  offsetBottom?: () => number;
  /** 容器下方预留（分页等） */
  reserveBottom?: () => number;
  /** 最小高度 */
  minHeight?: () => number;
  /** resize 防抖毫秒 */
  debounceMs?: () => number;
  /** 额外观察高度变化的节点（筛选区、工具栏等） */
  observe?: Ref<HTMLElement | null>[];
}

/**
 * 按视口剩余空间为容器写入 height，供列表 / 表格等主滚动区复用。
 * @param targetRef 需要定高的容器
 * @param options 偏移与预留等配置
 * @returns recalculate 手动重算
 */
export function useAdaptiveFillHeight(targetRef: Ref<HTMLElement | null>, options: AdaptiveFillHeightOptions = {}) {
  const getOffsetBottom = () => options.offsetBottom?.() ?? DEFAULT_ADAPTIVE_OFFSET_BOTTOM;
  const getReserveBottom = () => options.reserveBottom?.() ?? 0;
  const getMinHeight = () => options.minHeight?.() ?? DEFAULT_ADAPTIVE_MIN_HEIGHT_PX;
  const isEnabled = () => options.enabled?.() ?? true;

  /**
   * 根据当前视口与容器位置写入高度。
   */
  async function recalculate() {
    await nextTick();
    if (!isEnabled()) {
      return;
    }
    const element = targetRef.value;
    if (!element) {
      return;
    }
    const top = element.getBoundingClientRect().top;
    const height = Math.max(getMinHeight(), window.innerHeight - top - getOffsetBottom() - getReserveBottom());
    element.style.height = `${height}px`;
  }

  return useHeightBinding(targetRef, {
    enabled: options.enabled,
    debounceMs: options.debounceMs,
    observe: options.observe,
    getObserveTargets: () =>
      (options.observe ?? []).map((item) => item.value).filter((node): node is HTMLElement => node != null),
    recalculate,
  });
}
