<script lang="ts" setup>
import Segmented, { type OptionsType } from '@/components/ui/Segmented';
import { patchConfigureField } from '@/layout/hooks/configure/useUiConfigure';
import { getConfigureSnapshot } from '@/core/preferences/persistence/storage';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
/** 默认灵动模式 */
const markValue = ref(getConfigureSnapshot().showModel ?? 'smart');

const sectionTitleClass = ['mb-[12px]!', 'font-medium', 'text-sm', 'dark:text-white'];

const markOptions = computed<Array<OptionsType>>(() => {
  return [
    {
      label: t('panel.tagsStyleSmart'),
      tip: t('panel.tagsStyleSmartTip'),
      value: 'smart',
    },
    {
      label: t('panel.tagsStyleCard'),
      tip: t('panel.tagsStyleCardTip'),
      value: 'card',
    },
    {
      label: t('panel.tagsStyleChrome'),
      tip: t('panel.tagsStyleChromeTip'),
      value: 'chrome',
    },
  ];
});

/**
 * 切换标签风格
 * @param payload Segmented change 载荷
 */
function onChange({ option }: { option: { value: string } }): void {
  const { value } = option;
  markValue.value = value;
  patchConfigureField({ showModel: value });
}
</script>

<template>
  <div>
    <p :class="['mt-4!', sectionTitleClass]">{{ t('panel.tagsStyle') }}</p>
    <Segmented
      :modelValue="markValue === 'smart' ? 0 : markValue === 'card' ? 1 : 2"
      :options="markOptions"
      class="select-none"
      resize
      @change="onChange"
    />
  </div>
</template>
