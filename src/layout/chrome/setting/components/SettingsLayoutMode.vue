<script lang="ts" setup>
import { $t } from '@/app/plugins/i18n';
import { type LayoutMode } from '@/shared/utils/layout/layout-mode';
import { useLayoutShellRuntimeStore } from '@/store/modules/layout-shell-runtime';
import { useDisplayPreferencesStore } from '@/store/modules/preferences/display-preferences';
import { useLayoutPreferencesStore } from '@/store/modules/preferences/layout-preferences';
import isNumber from 'lodash/isNumber';
import { storeToRefs } from 'pinia';
import { type Component, computed } from 'vue';
import { useI18n } from 'vue-i18n';

import LayoutHorizontal from '@/assets/layout/layout-horizontal.svg?component';
import LayoutMix from '@/assets/layout/layout-mix.svg?component';
import LayoutVertical from '@/assets/layout/layout-vertical.svg?component';
import Segmented, { type OptionsType } from '@/components/ui/segmented';
import LeftArrow from '~icons/ri/arrow-left-s-line?width=20&height=20';
import RightArrow from '~icons/ri/arrow-right-s-line?width=20&height=20';

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
const viewportWideEnough = computed(() => layoutShellStore.viewportSize.width > 1280);

const layoutStore = useLayoutPreferencesStore();
const displayStore = useDisplayPreferencesStore();
const { layout } = storeToRefs(layoutStore);
const { stretch } = storeToRefs(displayStore);

/** 当前设备可见的导航模式选项（mobile 仅左侧） */
const visibleLayoutOptions = computed(() =>
  device.value === 'mobile' ? LAYOUT_OPTIONS.filter((item) => item.mode === 'vertical') : LAYOUT_OPTIONS
);

/** 页宽选项 */
const stretchTypeOptions = computed<Array<OptionsType>>(() => {
  return [
    {
      label: t('panel.stretchFixed'),
      tip: t('panel.stretchFixedTip'),
      value: 'fixed',
    },
    {
      label: t('panel.stretchCustom'),
      tip: t('panel.stretchCustomTip'),
      value: 'custom',
    },
  ];
});

/**
 * 页宽模式切换
 * @param payload Segmented change 载荷
 */
function stretchTypeChange({ option }: { option: { value: string } }): void {
  const { value } = option;
  displayStore.setStretch(value === 'custom' ? 1440 : false);
}
</script>

<template>
  <div>
    <p class="settings-panel__title settings-panel__title--spaced">{{ t('panel.layoutModel') }}</p>
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

    <div v-if="viewportWideEnough" class="settings-stretch">
      <p class="settings-panel__title settings-panel__title--spaced">{{ t('panel.stretch') }}</p>
      <Segmented
        :modelValue="isNumber(stretch) ? 1 : 0"
        :options="stretchTypeOptions"
        class="settings-stretch__segmented"
        resize
        @change="stretchTypeChange"
      />
      <el-input-number
        v-if="isNumber(stretch)"
        :model-value="stretch"
        :max="1600"
        :min="1280"
        controls-position="right"
        @change="(value) => displayStore.setStretch(value)"
      />
      <button v-else class="settings-stretch__preview" type="button" @click="displayStore.setStretch(!stretch)">
        <span
          :class="stretch ? 'settings-stretch__bar--narrow' : 'settings-stretch__bar--wide'"
          class="settings-stretch__bar"
        >
          <IconifyIconOffline :icon="stretch ? RightArrow : LeftArrow" />
          <span class="settings-stretch__rule" />
          <IconifyIconOffline :icon="stretch ? LeftArrow : RightArrow" />
        </span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.settings-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(62px, 1fr));
  gap: 12px;
  justify-items: center;

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

.settings-stretch {
  &__segmented {
    margin-bottom: 8px;
    user-select: none;
  }

  &__preview {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80px;
    cursor: pointer;
    background: transparent;
    border: 1px solid var(--auth-border-color);
    border-radius: 6px;
  }

  &__bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--el-color-primary);
    transition: all 300ms;

    &--narrow {
      width: 24%;
    }

    &--wide {
      width: 50%;
    }
  }

  &__rule {
    flex-grow: 1;
    border: 0;
    border-bottom: 1px dashed var(--el-color-primary);
  }
}
</style>
