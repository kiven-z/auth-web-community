<script lang="ts" setup>
import { $t } from '@/app/plugins/i18n';
import { type LayoutMode } from '@/shared/utils/layout/layout-mode';
import { useLayoutShellRuntimeStore } from '@/store/modules/layout-shell-runtime';
import { useLayoutPreferencesStore } from '@/store/modules/preferences/layout-preferences';
import { storeToRefs } from 'pinia';
import { type Component, computed } from 'vue';
import { useI18n } from 'vue-i18n';

import LayoutHorizontal from '@/assets/layout/layout-horizontal.svg?component';
import LayoutMix from '@/assets/layout/layout-mix.svg?component';
import LayoutVertical from '@/assets/layout/layout-vertical.svg?component';

/** 导航模式选项 */
interface LayoutOption {
  mode: LayoutMode;
  label: string;
  icon: Component;
}

const LAYOUT_OPTIONS: LayoutOption[] = [
  { mode: 'vertical', label: $t('panel.vertical'), icon: LayoutVertical },
  { mode: 'horizontal', label: $t('panel.horizontal'), icon: LayoutHorizontal },
  { mode: 'mix', label: $t('panel.mix'), icon: LayoutMix },
];

const { t } = useI18n();
const layoutShellStore = useLayoutShellRuntimeStore();
const { device } = storeToRefs(layoutShellStore);

const layoutStore = useLayoutPreferencesStore();
const { layout } = storeToRefs(layoutStore);

/** 当前设备可见的导航模式选项（mobile 仅左侧） */
const visibleLayoutOptions = computed(() =>
  device.value === 'mobile' ? LAYOUT_OPTIONS.filter((item) => item.mode === 'vertical') : LAYOUT_OPTIONS
);
</script>

<template>
  <div>
    <el-divider content-position="left">{{ t('panel.layoutModel') }}</el-divider>

    <ul class="settings-layout">
      <li
        v-for="item in visibleLayoutOptions"
        :key="item.mode"
        :class="{ 'settings-layout__item--selected': layout === item.mode }"
        class="settings-layout__item"
        @click="layoutStore.setLayout(item.mode)"
      >
        <span class="settings-layout__preview">
          <component :is="item.icon" aria-hidden="true" class="settings-layout__icon" />
        </span>
        <span class="settings-layout__label">{{ t(item.label) }}</span>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.settings-layout {
  display: grid;
  grid-template-columns: repeat(3, 62px);
  gap: 16px;
  justify-content: start;

  &__item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    width: 62px;
    cursor: pointer;
  }

  &__preview {
    position: relative;
    display: block;
    width: 56px;
    height: 44px;
    border-radius: var(--auth-radius-extra-large);

    &::after {
      position: absolute;
      inset: -4px;
      pointer-events: none;
      content: '';
      border: 2px solid var(--el-color-primary);
      border-radius: calc(var(--auth-radius-extra-large) + 4px);
      opacity: 0;
      transform: scale(0);
      transition:
        transform var(--auth-transition-duration) ease-out,
        opacity var(--auth-transition-duration) ease-out;
    }
  }

  &__icon {
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: var(--auth-radius-extra-large);
    box-shadow: var(--auth-shadow-1);
  }

  &__item--selected &__preview::after {
    opacity: 1;
    transform: scale(1);
  }

  &__label {
    font-size: 12px;
    line-height: 1.2;
    color: var(--auth-text-primary);
    text-align: center;
    white-space: nowrap;
  }
}
</style>
