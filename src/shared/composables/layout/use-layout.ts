import { runtimeLayoutOverride } from '@/core/preferences/runtime/layout-override';
import { useLayoutPreferencesStore } from '@/store/modules/preferences/layout-preferences';
import { toLayoutMode } from '@/shared/utils/layout/layout-mode';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

/**
 * 当前生效布局模式（含窄屏运行时覆盖）
 * @returns layout
 */
export function useLayout() {
  const layoutStore = useLayoutPreferencesStore();
  const { layout: storeLayout } = storeToRefs(layoutStore);

  const layout = computed(() => toLayoutMode(runtimeLayoutOverride.value ?? storeLayout.value));

  return { layout };
}
