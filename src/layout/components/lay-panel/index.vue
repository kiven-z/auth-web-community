<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { onClickOutside } from '@vueuse/core';
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { resetUiPreferences } from '@/core/preferences/runtime/actions';
import { useLayoutUiStore } from '@/store/modules/app/layout-ui';
import CloseIcon from '~icons/ep/close';

defineOptions({
  name: 'LayPanel',
});

const target = ref(null);
const layoutUiStore = useLayoutUiStore();
const { settingsPanelOpen } = storeToRefs(layoutUiStore);

const show = computed({
  get: () => settingsPanelOpen.value,
  set: (value: boolean) => layoutUiStore.toggleSettingsPanel(value),
});

const iconClass = computed(() => {
  return [
    'w-[22px]',
    'h-[22px]',
    'flex',
    'justify-center',
    'items-center',
    'outline-hidden',
    'rounded-[4px]',
    'cursor-pointer',
    'transition-colors',
    'hover:bg-black/6',
    'dark:hover:bg-white/12',
    'dark:hover:text-auth-text',
  ];
});

const { t } = useI18n();
const onReset = resetUiPreferences;

onClickOutside(target, (event: any) => {
  if (event.clientX > target.value.offsetLeft) return;
  layoutUiStore.closeSettingsPanel();
});
</script>

<template>
  <div :class="['settings-panel', { 'settings-panel--open': show }]">
    <div class="settings-panel__backdrop" />
    <div ref="target" class="settings-panel__drawer bg-auth-container">
      <div class="settings-panel__header border-0 border-b border-solid border-(--auth-border-color)">
        <h4 class="dark:text-white">
          {{ t('panel.systemSettings') }}
        </h4>
        <span
          v-tippy="{
            content: t('panel.closeSystemSettings'),
            placement: 'bottom-start',
            zIndex: 41000,
          }"
          :class="iconClass"
        >
          <IconifyIconOffline
            :icon="CloseIcon"
            class="dark:text-white"
            height="18px"
            width="18px"
            @click="layoutUiStore.closeSettingsPanel()"
          />
        </span>
      </div>
      <el-scrollbar>
        <slot />
      </el-scrollbar>

      <div class="flex justify-end p-3 border-0 border-t border-solid border-(--auth-border-color)">
        <el-button
          v-tippy="{
            content: t('panel.clearCacheAndToLogin'),
            placement: 'left-start',
            zIndex: 41000,
          }"
          bg
          text
          type="danger"
          @click="onReset"
        >
          {{ t('panel.clearCache') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-scrollbar) {
  height: calc(100vh - 110px);
}

.settings-panel__backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  background: rgb(0 0 0 / 20%);
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
}

.settings-panel__drawer {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 40000;
  width: 100%;
  max-width: 280px;
  box-shadow: 0 0 15px 0 rgb(0 0 0 / 5%);
  transform: translate(100%);
  transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
}

.settings-panel--open {
  transition: all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);

  .settings-panel__backdrop {
    z-index: 20000;
    width: 100%;
    height: 100%;
    opacity: 1;
  }

  .settings-panel__drawer {
    transform: translate(0);
  }
}

.settings-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
}
</style>
