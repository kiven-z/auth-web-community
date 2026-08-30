import { useResizeObserver } from '@vueuse/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { init, use, type EChartsCoreOption, type EChartsType } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { onBeforeUnmount, onMounted, type Ref, shallowRef, unref } from 'vue';

use([LineChart, GridComponent, TooltipComponent, CanvasRenderer]);

/** useECharts 返回值 */
interface UseEChartsReturn {
  /** 写入并渲染 option */
  setOptions: (options: EChartsCoreOption) => void;
  /** 当前 ECharts 实例 */
  getInstance: () => EChartsType | undefined;
}

/**
 * 绑定容器的 ECharts 生命周期（init / setOption / resize / dispose）
 * @param elRef 图表容器 ref
 * @returns setOptions、getInstance
 */
export function useECharts(elRef: Ref<HTMLElement | undefined | null>): UseEChartsReturn {
  const instanceRef = shallowRef<EChartsType>();

  function getInstance(): EChartsType | undefined {
    return instanceRef.value;
  }

  function ensureInstance(): EChartsType | undefined {
    const element = unref(elRef);
    if (!element) {
      return undefined;
    }
    if (!instanceRef.value) {
      instanceRef.value = init(element);
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
