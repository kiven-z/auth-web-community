<script lang="ts" setup>
import Segmented, { type OptionsType } from '@/components/ui/Segmented';
import { patchConfigureField } from '@/layout/hooks/configure/useUiConfigure';
import { useUiLayout } from '@/layout/hooks/layout/useUiLayout';
import { getConfigureSnapshot, getUiPreferenceState } from '@/core/preferences/persistence/storage';
import { useAppStore } from '@/store/modules/app/app';
import { toggleClass } from '@/shared/utils/dom/className';
import { LAYOUT_MODES, type LayoutMode, toLayoutMode } from '@/shared/utils/layout/layout-mode';
import debounce from 'lodash/debounce';
import isNumber from 'lodash/isNumber';
import { storeToRefs } from 'pinia';
import { computed, reactive, ref, unref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import LeftArrow from '~icons/ri/arrow-left-s-line?width=20&height=20';
import RightArrow from '~icons/ri/arrow-right-s-line?width=20&height=20';

const { t } = useI18n();
const { device } = storeToRefs(useAppStore());
const preferenceState = getUiPreferenceState();
const { setLayoutMode, layoutTheme } = useUiLayout();

const mixRef = ref();
const verticalRef = ref();
const horizontalRef = ref();

const layoutPreviewRefs: Record<LayoutMode, typeof verticalRef> = {
  vertical: verticalRef,
  horizontal: horizontalRef,
  mix: mixRef,
};

const settings = reactive({
  stretch: getConfigureSnapshot().stretch,
});

const sectionTitleClass = ['mb-[12px]!', 'font-medium', 'text-sm', 'dark:text-white'];

/**
 * 清除布局预览卡选中态
 * @param doms 预览卡 ref 列表
 */
function clearLayoutSelect(doms: Array<unknown>): void {
  doms.forEach((item) => {
    toggleClass(false, 'settings-layout__preview--selected', unref(item as never));
  });
}

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
 * 写入页宽偏好
 * @param value false | 自定义宽度
 */
function setStretch(value: boolean | number): void {
  settings.stretch = value;
  patchConfigureField({ stretch: value });
}

/**
 * 页宽模式切换
 * @param payload Segmented change 载荷
 */
function stretchTypeChange({ option }: { option: { value: string } }): void {
  const { value } = option;
  value === 'custom' ? setStretch(1440) : setStretch(false);
}

/**
 * 设置导航布局模式
 * @param layout 布局模式
 */
function setLayoutModel(layout: LayoutMode): void {
  setLayoutMode(layout);
}

watch(
  () => preferenceState.layout?.layout,
  (rawMode) => {
    const layoutMode = toLayoutMode(rawMode);
    const selectedRef = layoutPreviewRefs[layoutMode];
    toggleClass(true, 'settings-layout__preview--selected', unref(selectedRef));
    const others = LAYOUT_MODES.filter((mode) => mode !== layoutMode).map((mode) => layoutPreviewRefs[mode]);
    debounce(() => clearLayoutSelect(others), 50)();
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <p :class="['mt-5!', sectionTitleClass]">{{ t('panel.layoutModel') }}</p>
    <ul class="settings-layout">
      <li
        ref="verticalRef"
        v-tippy="{
          content: t('panel.verticalTip'),
          zIndex: 41000,
        }"
        :class="layoutTheme.layout === 'vertical' ? 'settings-layout__preview--selected' : ''"
        @click="setLayoutModel('vertical')"
      >
        <div />
        <div />
      </li>
      <li
        v-if="device !== 'mobile'"
        ref="horizontalRef"
        v-tippy="{
          content: t('panel.horizontalTip'),
          zIndex: 41000,
        }"
        :class="layoutTheme.layout === 'horizontal' ? 'settings-layout__preview--selected' : ''"
        @click="setLayoutModel('horizontal')"
      >
        <div />
        <div />
      </li>
      <li
        v-if="device !== 'mobile'"
        ref="mixRef"
        v-tippy="{
          content: t('panel.mixTip'),
          zIndex: 41000,
        }"
        :class="layoutTheme.layout === 'mix' ? 'settings-layout__preview--selected' : ''"
        @click="setLayoutModel('mix')"
      >
        <div />
        <div />
      </li>
    </ul>

    <div v-if="useAppStore().getViewportWidth > 1280">
      <p :class="['mt-5!', sectionTitleClass]">{{ t('panel.stretch') }}</p>
      <Segmented
        :modelValue="isNumber(settings.stretch) ? 1 : 0"
        :options="stretchTypeOptions"
        class="mb-2 select-none"
        resize
        @change="stretchTypeChange"
      />
      <el-input-number
        v-if="isNumber(settings.stretch)"
        v-model="settings.stretch as number"
        :max="1600"
        :min="1280"
        controls-position="right"
        @change="(value) => setStretch(value)"
      />
      <button
        v-else
        class="bg-transparent flex-c w-full h-20 rounded-md border border-(--auth-border-color) cursor-pointer transition-transform duration-150 active:scale-[0.99]"
        type="button"
        @click="setStretch(!settings.stretch)"
      >
        <span
          :class="[settings.stretch ? 'w-[24%]' : 'w-[50%]']"
          class="flex-bc transition-all duration-300"
          style="color: var(--el-color-primary)"
        >
          <IconifyIconOffline :icon="settings.stretch ? RightArrow : LeftArrow" />
          <span class="grow border-0 border-b border-dashed" style="border-color: var(--el-color-primary)" />
          <IconifyIconOffline :icon="settings.stretch ? LeftArrow : RightArrow" />
        </span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.settings-layout {
  /* 布局示意色：固定亮色块，不跟 html.dark 翻转 */
  --settings-layout-page: #ebeef2;
  --settings-layout-chrome: #292c3d;
  --settings-layout-panel: #fff;
  --settings-layout-edge: rgb(0 0 0 / 12%);

  display: flex;
  gap: 12px;

  li {
    position: relative;
    width: 46px;
    height: 36px;
    overflow: hidden;
    cursor: pointer;
    background: var(--settings-layout-page);
    border-radius: var(--auth-radius-extra-large);
    box-shadow: var(--auth-shadow-1);

    &:nth-child(1) {
      div {
        &:nth-child(1) {
          width: 30%;
          height: 100%;
          background: var(--settings-layout-chrome);
        }

        &:nth-child(2) {
          position: absolute;
          top: 0;
          right: 0;
          width: 70%;
          height: 30%;
          background: var(--settings-layout-panel);
          box-shadow: 0 0 1px var(--settings-layout-edge);
        }
      }
    }

    &:nth-child(2) {
      div {
        &:nth-child(1) {
          width: 100%;
          height: 30%;
          background: var(--settings-layout-chrome);
          box-shadow: 0 0 1px var(--settings-layout-edge);
        }
      }
    }

    &:nth-child(3) {
      div {
        &:nth-child(1) {
          width: 100%;
          height: 30%;
          background: var(--settings-layout-chrome);
          box-shadow: 0 0 1px var(--settings-layout-edge);
        }

        &:nth-child(2) {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 30%;
          height: 70%;
          background: var(--settings-layout-panel);
          box-shadow: 0 0 1px var(--settings-layout-edge);
        }
      }
    }
  }
}

.settings-layout__preview--selected {
  border: 2px solid var(--el-color-primary);
}
</style>
