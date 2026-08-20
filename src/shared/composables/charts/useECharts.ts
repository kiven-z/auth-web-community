import { useResizeObserver } from '@vueuse/core';
import * as echarts from 'echarts';
import type { EChartsCoreOption } from 'echarts';
import { onBeforeUnmount, onMounted, type Ref, shallowRef, unref } from 'vue';

/** ECharts 实例（与 echarts.init 返回类型一致） */
type ChartInstance = ReturnType<typeof echarts.init>;

/** useECharts 返回值 */
export interface UseEChartsReturn {
  /** 写入并渲染 option */
  setOptions: (options: EChartsCoreOption) => void;
  /** 当前 ECharts 实例 */
  getInstance: () => ChartInstance | undefined;
}

/**
 * 绑定容器的 ECharts 生命周期（init / setOption / resize / dispose）
 * @param elRef 图表容器 ref
 * @returns setOptions、getInstance
 */
export function useECharts(elRef: Ref<HTMLElement | undefined | null>): UseEChartsReturn {
  const instanceRef = shallowRef<ChartInstance>();

  function getInstance(): ChartInstance | undefined {
    return instanceRef.value;
  }

  function ensureInstance(): ChartInstance | undefined {
    const element = unref(elRef);
    if (!element) {
      return undefined;
    }
    if (!instanceRef.value) {
      instanceRef.value = echarts.init(element);
    }
    return instanceRef.value;
  }

  function setOptions(options: EChartsCoreOption): void {
    const chart = ensureInstance();
    chart?.setOption(options, { notMerge: true });
  }

  function resize(): void {
    instanceRef.value?.resize();
  }

  onMounted(() => {
    ensureInstance();
  });

  useResizeObserver(elRef, () => {
    resize();
  });

  onBeforeUnmount(() => {
    instanceRef.value?.dispose();
    instanceRef.value = undefined;
  });

  return { setOptions, getInstance };
}
