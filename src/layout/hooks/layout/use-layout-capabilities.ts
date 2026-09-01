import { useLayout } from '@/shared/composables/layout/use-layout';
import { resolveLayoutCapabilities, toLayoutMode } from '@/shared/utils/layout/layout-mode';
import { computed } from 'vue';

/**
 * 当前生效布局的壳层展示能力（含运行时窄屏覆盖）
 * @returns capabilities computed
 */
export function useLayoutCapabilities() {
  const { layout } = useLayout();

  const capabilities = computed(() => resolveLayoutCapabilities(toLayoutMode(layout.value)));

  return {
    capabilities,
    mode: computed(() => capabilities.value.mode),
  };
}
