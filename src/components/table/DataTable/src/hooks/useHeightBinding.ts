import { useDebounceFn, useEventListener, useResizeObserver } from '@vueuse/core';
import type { Ref } from 'vue';
import { nextTick, ref, watch } from 'vue';

import { DEFAULT_ADAPTIVE_DEBOUNCE_MS } from '../constants';

/** 高度绑定：监听与生命周期配置（包内复用） */
export interface HeightBindingOptions {
  /** 是否启用 */
  enabled?: () => boolean;
  /** resize 防抖毫秒 */
  debounceMs?: () => number;
  /** 额外观察节点（筛选区、外层容器等） */
  observe?: Ref<HTMLElement | null>[];
  /** 当前应挂到 ResizeObserver 的节点 */
  getObserveTargets: () => HTMLElement[];
  /** 写入高度的策略 */
  recalculate: () => void | Promise<void>;
}

/**
 * 为定高策略挂载 resize / ResizeObserver 与生命周期。
 * @param targetRef 定高目标
 * @param options 启用、观察与重算策略
 * @returns recalculate 手动重算（即传入的策略）
 */
export function useHeightBinding(targetRef: Ref<HTMLElement | null>, options: HeightBindingOptions) {
  const isEnabled = () => options.enabled?.() ?? true;
  const { recalculate } = options;

  const debouncedRecalculate = useDebounceFn(
    () => {
      if (isEnabled()) {
        recalculate();
      }
    },
    () => options.debounceMs?.() ?? DEFAULT_ADAPTIVE_DEBOUNCE_MS
  );

  // 用 ref 承接，避免 computed 每次 new array 导致 observer 反复重建
  const observeTargets = ref<HTMLElement[]>([]);

  function syncObserveTargets() {
    observeTargets.value = isEnabled() ? options.getObserveTargets() : [];
  }

  useEventListener(globalThis, 'resize', () => {
    if (isEnabled()) {
      debouncedRecalculate();
    }
  });

  useResizeObserver(observeTargets, () => {
    debouncedRecalculate();
  });

  async function activate() {
    if (!isEnabled()) {
      return;
    }
    await nextTick();
    syncObserveTargets();
    await recalculate();
  }

  // immediate 覆盖挂载与 target 晚到（v-if / 异步）
  watch(
    targetRef,
    (element) => {
      if (element) {
        activate().catch(() => undefined);
      }
    },
    { immediate: true }
  );

  if (options.observe?.length) {
    watch(
      () => options.observe.map((item) => item.value),
      () => {
        if (!isEnabled()) {
          return;
        }
        syncObserveTargets();
        recalculate();
      }
    );
  }

  return { recalculate };
}
