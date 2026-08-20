import type { Ref } from 'vue';
import { nextTick } from 'vue';

import { useHeightBinding } from './useHeightBinding';

/** 填满定高父级的配置 */
export interface FillParentHeightOptions {
  /** 是否启用 */
  enabled?: () => boolean;
  /** resize 防抖毫秒 */
  debounceMs?: () => number;
  /** 额外观察尺寸变化的节点（外层定高容器等） */
  observe?: Ref<HTMLElement | null>[];
}

/**
 * 按父级剩余空间为容器写入 height（量真实兄弟节点，不用魔法 reserve）。
 * @param targetRef 需要定高的表体容器
 * @param options 启用与观察配置
 * @returns recalculate 手动重算
 */
export function useFillParentHeight(targetRef: Ref<HTMLElement | null>, options: FillParentHeightOptions = {}) {
  const isEnabled = () => options.enabled?.() ?? true;

  /**
   * 父级 clientHeight 减去其它子节点占用后写入目标高度。
   */
  async function recalculate() {
    await nextTick();
    const element = targetRef.value;
    if (!element) {
      return;
    }
    if (!isEnabled()) {
      element.style.removeProperty('height');
      return;
    }
    const parent = element.parentElement;
    if (!parent) {
      return;
    }
    let usedHeight = 0;
    for (const child of Array.from(parent.children)) {
      if (child === element) {
        continue;
      }
      const htmlChild = child as HTMLElement;
      const style = getComputedStyle(htmlChild);
      usedHeight += htmlChild.offsetHeight;
      usedHeight += Number.parseFloat(style.marginTop) || 0;
      usedHeight += Number.parseFloat(style.marginBottom) || 0;
    }
    const height = Math.max(0, parent.clientHeight - usedHeight);
    element.style.height = `${height}px`;
  }

  return useHeightBinding(targetRef, {
    enabled: options.enabled,
    debounceMs: options.debounceMs,
    observe: options.observe,
    getObserveTargets: () => {
      const targets: HTMLElement[] = [];
      const parent = targetRef.value?.parentElement;
      if (parent) {
        targets.push(parent);
      }
      for (const item of options.observe ?? []) {
        if (item.value) {
          targets.push(item.value);
        }
      }
      return targets;
    },
    recalculate,
  });
}
