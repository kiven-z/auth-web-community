import {
  createDefaultConfigure,
  createDefaultLayout,
  createDefaultLocale,
  DEFAULT_LOCALE,
} from '@/core/preferences/defaults/preference-defaults';
import { getUiPreferenceState } from '@/core/preferences/persistence/storage';
import { getRuntimeLayoutOverrideRef } from '@/core/preferences/defaults/runtime-layout';
import { toLayoutMode } from '@/shared/utils/layout/layout-mode';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 布局模式与本地偏好初始化
 * @returns layout / layoutTheme / initStorage
 */
export function useLayout() {
  const preferenceState = getUiPreferenceState();
  const runtimeLayoutOverride = getRuntimeLayoutOverrideRef();

  const initStorage = () => {
    if (!preferenceState.locale) {
      preferenceState.locale = createDefaultLocale();
      useI18n().locale.value = DEFAULT_LOCALE;
    }
    if (!preferenceState.layout) {
      preferenceState.layout = createDefaultLayout();
    }
    if (!preferenceState.configure) {
      preferenceState.configure = createDefaultConfigure();
    }
  };

  const layout = computed(() => {
    return toLayoutMode(runtimeLayoutOverride.value ?? preferenceState?.layout.layout);
  });

  const layoutTheme = computed(() => {
    return preferenceState.layout;
  });

  return {
    layout,
    layoutTheme,
    initStorage,
  };
}
