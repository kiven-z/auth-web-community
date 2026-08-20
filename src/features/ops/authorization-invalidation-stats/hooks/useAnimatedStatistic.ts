import { useTransition } from '@vueuse/core';
import { type MaybeRefOrGetter, ref, toValue, watch } from 'vue';

/** 默认数字滚动时长（毫秒） */
export const DEFAULT_STATISTIC_TRANSITION_MS = 800;

/**
 * 将数值源平滑过渡到展示值（刷新时从旧值过渡，不回零）
 * @param source 目标数值
 * @param duration 动画时长（毫秒）
 * @returns 过渡中的展示值
 */
export function useAnimatedStatistic(source: MaybeRefOrGetter<number>, duration = DEFAULT_STATISTIC_TRANSITION_MS) {
  const sourceValue = ref(0);
  const displayValue = useTransition(sourceValue, {
    duration,
  });

  watch(
    () => {
      const raw = Number(toValue(source));
      return Number.isFinite(raw) ? raw : 0;
    },
    (next) => {
      sourceValue.value = next;
    },
    { immediate: true }
  );

  return displayValue;
}
