<script lang="ts" setup>
import { getMenuTooltipEffect } from '@/shared/utils/platform';
import { useThemePreferencesStore } from '@/store/modules/preferences/themePreferences';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import ArrowLeft from '~icons/ri/arrow-left-double-fill';
import MenuFold from '~icons/ri/menu-fold-fill';

interface Props {
  /** left：底栏折叠；center：侧栏中线折叠按钮 */
  variant: 'left' | 'center';
  isActive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
});

const emit = defineEmits<{
  toggleClick: [];
}>();

const { t } = useI18n();
const tooltipEffect = getMenuTooltipEffect();
const themeStore = useThemePreferencesStore();
const { navTheme } = storeToRefs(themeStore);
const isLightTheme = computed(() => navTheme.value === 'light');

const tipContent = computed(() => (props.isActive ? t('buttons.clickCollapse') : t('buttons.clickExpand')));
const foldIcon = computed(() => (props.variant === 'left' ? MenuFold : ArrowLeft));
</script>

<template>
  <div v-if="variant === 'left'" class="sidebar-collapse sidebar-collapse--left">
    <IconifyIconOffline
      v-tippy="{
        content: tipContent,
        theme: tooltipEffect,
        hideOnClick: 'toggle',
        placement: 'right',
      }"
      :class="[
        'ml-4',
        'mb-1',
        'w-4',
        'h-4',
        'inline-block!',
        'align-middle',
        'cursor-pointer',
        'duration-100',
        isLightTheme ? '' : 'text-primary',
      ]"
      :icon="foldIcon"
      :style="{ transform: isActive ? 'none' : 'rotateY(180deg)' }"
      @click="emit('toggleClick')"
    />
  </div>
  <div
    v-else
    v-tippy="{
      content: tipContent,
      theme: tooltipEffect,
      hideOnClick: 'toggle',
      placement: 'right',
    }"
    class="sidebar-collapse sidebar-collapse--center"
    @click="emit('toggleClick')"
  >
    <IconifyIconOffline
      :class="['w-4', 'h-4', isLightTheme ? '' : 'text-primary']"
      :icon="foldIcon"
      :style="{ transform: isActive ? 'none' : 'rotateY(180deg)' }"
    />
  </div>
</template>

<style lang="scss" scoped>
.sidebar-collapse--left {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-top: 1px solid var(--auth-theme-border, var(--auth-border-color));
}

.sidebar-collapse--center {
  position: absolute;
  top: 50%;
  right: 2px;
  z-index: 1002;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 34px;
  cursor: pointer;
  background: var(--el-bg-color);
  border: 1px solid var(--auth-border-color);
  border-radius: 4px;
  transform: translate(12px, -50%);
}
</style>
