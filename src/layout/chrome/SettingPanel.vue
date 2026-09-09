<script lang="ts" setup>
import { storageLocal } from '@/core/storage/storage-local';
import { multiConfirm } from '@/services/feedback/dialog';
import { useUserStore } from '@/store/modules/auth/user';
import { useLayoutShellRuntimeStore } from '@/store/modules/layout-shell-runtime';
import { onClickOutside } from '@vueuse/core';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import CloseIcon from '~icons/ep/close';

defineOptions({
  name: 'SettingPanel',
});

const target = ref(null);
const layoutShellStore = useLayoutShellRuntimeStore();
const userStore = useUserStore();

const { t } = useI18n();

/**
 * 确认后吊销会话、清本机全部 localStorage
 * 返回登录页
 */
async function handleClearCache() {
  layoutShellStore.settingsPanelOpen = false;
  const confirmed = await multiConfirm([
    { title: t('panel.clearCacheConfirmTitle'), message: t('panel.clearCacheConfirm') },
  ]);
  if (!confirmed) {
    return;
  }
  await userStore.logoutAndClear();
  storageLocal().clear();
}

onClickOutside(target, (event: any) => {
  if (event.clientX > target.value.offsetLeft) return;
  layoutShellStore.settingsPanelOpen = false;
});
</script>

<template>
  <div :class="['settings-panel', { 'settings-panel--open': layoutShellStore.settingsPanelOpen }]">
    <div class="settings-panel__backdrop" />
    <div ref="target" class="settings-panel__drawer">
      <div class="settings-panel__header">
        <h4 class="settings-panel__title">
          {{ t('panel.systemSettings') }}
        </h4>
        <span class="settings-panel__close">
          <CloseIcon
            class="settings-panel__close-icon"
            height="18px"
            width="18px"
            @click="layoutShellStore.settingsPanelOpen = false"
          />
        </span>
      </div>
      <el-scrollbar>
        <slot />
      </el-scrollbar>

      <div class="settings-panel__footer">
        <el-button class="w-full" type="danger" @click="handleClearCache">
          {{ t('panel.clearCache') }}
        </el-button>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
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
  inset: 0 0 0 auto;
  z-index: 40000;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 280px;
  background: var(--auth-bg-container);
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
  border-bottom: 1px solid var(--auth-border-color);
}

.settings-panel__title {
  margin: 0;
  color: var(--auth-text-primary);
}

.settings-panel__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  cursor: pointer;
  outline: none;
  border-radius: 4px;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: rgb(0 0 0 / 6%);
  }
}

.settings-panel__close-icon {
  color: var(--auth-text-primary);
}

.settings-panel__footer {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid var(--auth-border-color);
}
</style>
