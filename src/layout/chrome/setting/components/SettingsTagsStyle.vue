<script lang="ts" setup>
import Segmented, { type OptionsType } from '@/components/ui/Segmented';
import { useDisplayPreferencesStore } from '@/store/modules/preferences/displayPreferences';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = useDisplayPreferencesStore();
const { showModel } = storeToRefs(store);

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
</script>

<template>
  <div class="settings-tags">
    <p class="settings-panel__title settings-panel__title--spaced-sm">{{ t('panel.tagsStyle') }}</p>
    <Segmented
      :modelValue="showModel === 'smart' ? 0 : showModel === 'card' ? 1 : 2"
      :options="markOptions"
      class="settings-tags__segmented"
      resize
      @change="({ option }) => store.setShowModel(option.value)"
    />
  </div>
</template>

<style lang="scss" scoped>
.settings-tags {
  &__segmented {
    user-select: none;
  }
}
</style>
