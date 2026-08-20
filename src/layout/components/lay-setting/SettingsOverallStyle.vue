<script lang="ts" setup>
import Segmented, { type OptionsType } from '@/components/ui/Segmented';
import { syncSystemThemeFromOs } from '@/core/preferences/runtime/system-theme';
import { useUiTheme } from '@/layout/hooks/theme/useUiTheme';
import { useDark } from '@/shared/composables/theme/useDark';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import Check from '~icons/ep/check';
import ComputerIcon from '~icons/ri/computer-line';
import MoonIcon from '~icons/ri/moon-line';
import SunIcon from '~icons/ri/sun-line';

const { t } = useI18n();
const { isDark } = useDark();
const { dataTheme, colorScheme, layoutTheme, themeColors, setColorScheme, setNavTheme } = useUiTheme();

/** 浅色色板：选中勾用深色，并加描边以免融进背景 */
const LIGHT_THEME_SWATCHES = new Set(['light', 'amberYellow']);

const sectionTitleClass = ['mb-[12px]!', 'font-medium', 'text-sm', 'dark:text-white'];

/**
 * 当前整体风格下可见的侧栏色板（暗色模式隐藏白侧栏）
 */
const visibleThemeColors = computed(() => {
  return themeColors.value.filter((item) => !(item.navTheme === 'light' && isDark.value));
});

/**
 * 主题色选中勾颜色（浅色板用深色勾，其余用白色勾）
 * @param current 侧栏皮肤标识
 * @returns 勾选图标颜色
 */
function getThemeCheckColor(current: string): string {
  if (current !== layoutTheme.value.navTheme) {
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
      iconAttrs: { fill: isDark.value ? 'var(--auth-text-anti)' : 'var(--auth-text-primary)' },
    },
    {
      label: t('panel.overallStyleDark'),
      icon: MoonIcon,
      theme: 'dark',
      tip: t('panel.overallStyleDarkTip'),
      iconAttrs: { fill: isDark.value ? 'var(--auth-text-anti)' : 'var(--auth-text-primary)' },
    },
    {
      label: t('panel.overallStyleSystem'),
      icon: ComputerIcon,
      theme: 'system',
      tip: t('panel.overallStyleSystemTip'),
      iconAttrs: { fill: isDark.value ? 'var(--auth-text-anti)' : 'var(--auth-text-primary)' },
    },
  ];
});

/**
 * 切换浅色 / 深色 / 跟随系统
 * @param theme Segmented change 载荷
 */
function handleColorSchemeChange(theme: { index: number; option: { theme: string } }): void {
  if (theme.index === 2) {
    dataTheme.value = globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
    setColorScheme(theme.option.theme);
    syncSystemThemeFromOs();
    return;
  }
  dataTheme.value = theme.index === 1;
  setColorScheme(theme.option.theme);
}
</script>

<template>
  <div>
    <p :class="sectionTitleClass">{{ t('panel.overallStyle') }}</p>
    <Segmented
      :modelValue="colorScheme === 'system' ? 2 : dataTheme ? 1 : 0"
      :options="themeOptions"
      class="select-none"
      resize
      @change="handleColorSchemeChange"
    />

    <p :class="['mt-5!', sectionTitleClass]">{{ t('panel.themeColor') }}</p>
    <ul class="theme-color">
      <li
        v-for="item in visibleThemeColors"
        :key="item.navTheme"
        :class="{ 'theme-color__swatch--light': LIGHT_THEME_SWATCHES.has(item.navTheme) }"
        :style="{ background: item.color }"
        class="theme-color__swatch"
        @click="setNavTheme(item.navTheme)"
      >
        <el-icon :color="getThemeCheckColor(item.navTheme)" :size="14" class="theme-color__check">
          <IconifyIconOffline :icon="Check" />
        </el-icon>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
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
