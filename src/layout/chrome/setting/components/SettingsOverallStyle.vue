<script lang="ts" setup>
import Segmented, { type OptionsType } from '@/components/ui/segmented';
import { NAV_THEME_COLOR_ITEMS } from '@/core/config/ui-config';
import { useThemePreferencesStore } from '@/store/modules/preferences/theme-preferences';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import Check from '~icons/ep/check';
import ComputerIcon from '~icons/ri/computer-line';
import MoonIcon from '~icons/ri/moon-line';
import SunIcon from '~icons/ri/sun-line';

const { t } = useI18n();
const store = useThemePreferencesStore();
const { colorScheme, navTheme, isDarkMode } = storeToRefs(store);

/** 浅色色板：选中勾用深色，并加描边以免融进背景 */
const LIGHT_THEME_SWATCHES = new Set(['light', 'amberYellow']);

/**
 * 当前整体风格下可见的侧栏色板（暗色模式隐藏白侧栏）
 */
const visibleThemeColors = computed(() =>
  NAV_THEME_COLOR_ITEMS.filter((item) => !(item.navTheme === 'light' && isDarkMode.value))
);

/**
 * 主题色选中勾颜色（浅色板用深色勾，其余用白色勾）
 * @param current 侧栏皮肤标识
 * @returns 勾选图标颜色
 */
function getThemeCheckColor(current: string): string {
  if (current !== navTheme.value) {
    return 'transparent';
  }
  return LIGHT_THEME_SWATCHES.has(current) ? 'var(--auth-color-gray-12)' : 'var(--auth-text-anti)';
}

const themeOptions = computed<Array<OptionsType>>(() => {
  return [
    {
      label: t('panel.overallStyleLight'),
      icon: SunIcon,
      theme: 'light',
      tip: t('panel.overallStyleLightTip'),
      iconAttrs: { fill: isDarkMode.value ? 'var(--auth-text-anti)' : 'var(--auth-text-primary)' },
    },
    {
      label: t('panel.overallStyleDark'),
      icon: MoonIcon,
      theme: 'dark',
      tip: t('panel.overallStyleDarkTip'),
      iconAttrs: { fill: isDarkMode.value ? 'var(--auth-text-anti)' : 'var(--auth-text-primary)' },
    },
    {
      label: t('panel.overallStyleSystem'),
      icon: ComputerIcon,
      theme: 'system',
      tip: t('panel.overallStyleSystemTip'),
      iconAttrs: { fill: isDarkMode.value ? 'var(--auth-text-anti)' : 'var(--auth-text-primary)' },
    },
  ];
});
</script>

<template>
  <div class="settings-overall">
    <p class="settings-panel__title">{{ t('panel.overallStyle') }}</p>
    <Segmented
      :modelValue="colorScheme === 'system' ? 2 : isDarkMode ? 1 : 0"
      :options="themeOptions"
      class="settings-overall__segmented"
      resize
      @change="(theme) => store.setColorScheme(theme.option.theme)"
    />

    <p class="settings-panel__title settings-panel__title--spaced">{{ t('panel.themeColor') }}</p>
    <ul class="theme-color">
      <li
        v-for="item in visibleThemeColors"
        :key="item.navTheme"
        :class="{ 'theme-color__swatch--light': LIGHT_THEME_SWATCHES.has(item.navTheme) }"
        :style="{ background: item.color }"
        class="theme-color__swatch"
        @click="store.setNavTheme(item.navTheme)"
      >
        <el-icon :color="getThemeCheckColor(item.navTheme)" :size="14" class="theme-color__check">
          <IconifyIconOffline :icon="Check" />
        </el-icon>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.settings-overall {
  &__segmented {
    user-select: none;
  }
}

.theme-color {
  display: grid;
  grid-template-columns: repeat(auto-fill, 28px);
  gap: 10px;

  &__swatch {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    cursor: pointer;
    border-radius: 6px;
    transition: transform 0.15s ease;

    &:hover {
      transform: scale(1.08);
    }

    &--light {
      border: 1px solid var(--el-border-color);
    }
  }
}
</style>
