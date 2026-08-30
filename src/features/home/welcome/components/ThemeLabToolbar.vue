<script lang="ts" setup>
import type { ColorScheme } from '@/core/config/uiConfig';
import { useThemePreferencesStore } from '@/store/modules/preferences/themePreferences';
import { storeToRefs } from 'pinia';
import { THEME_LAB_PRIMARY_PRESETS } from '../constants/themeLabPalettes';

defineOptions({
  name: 'ThemeLabToolbar',
});

const themeStore = useThemePreferencesStore();
const { colorScheme, primaryColor: activePrimaryColor } = storeToRefs(themeStore);

const colorSchemeOptions = [
  { label: '浅色', value: 'light' },
  { label: '深色', value: 'dark' },
  { label: '跟随系统', value: 'system' },
] as const;

/**
 * 切换颜色方案
 * @param scheme 方案值
 */
function handleColorSchemeChange(scheme: string | number | boolean): void {
  const next = String(scheme);
  if (next !== 'light' && next !== 'dark' && next !== 'system') {
    return;
  }
  themeStore.setColorScheme(next as ColorScheme);
}
</script>

<template>
  <div class="theme-lab-toolbar">
    <div class="theme-lab-toolbar__group">
      <span class="theme-lab-toolbar__label">颜色方案</span>
      <el-segmented :model-value="colorScheme" :options="[...colorSchemeOptions]" @change="handleColorSchemeChange" />
    </div>

    <div class="theme-lab-toolbar__group">
      <span class="theme-lab-toolbar__label">主色预设</span>
      <div class="theme-lab-toolbar__swatches">
        <button
          v-for="color in THEME_LAB_PRIMARY_PRESETS"
          :key="color"
          :class="{ 'theme-lab-toolbar__swatch--active': color === activePrimaryColor }"
          :style="{ backgroundColor: color }"
          :title="color"
          class="theme-lab-toolbar__swatch"
          type="button"
          @click="themeStore.setPrimaryColor(color)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.theme-lab-toolbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  gap: 16px 24px;
  align-items: center;
  padding: 12px 16px;
  background: var(--auth-bg-container);
  border: 1px solid var(--auth-color-border);
  border-radius: var(--auth-radius-default);

  &__group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  &__label {
    font-size: var(--auth-font-size-small);
    color: var(--auth-text-secondary);
    white-space: nowrap;
  }

  &__swatches {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  &__swatch {
    width: 22px;
    height: 22px;
    padding: 0;
    cursor: pointer;
    outline: 1px solid var(--auth-color-border);
    border: 2px solid transparent;
    border-radius: 4px;

    &--active {
      outline-color: var(--auth-text-primary);
      border-color: var(--auth-text-primary);
    }
  }
}
</style>
