<script lang="ts" setup>
import { useLayoutCapabilities } from '@/layout/hooks/layout/useLayoutCapabilities';
import MixTopMenu from '@/layout/shell/MixTopMenu.vue';
import HeaderToolbar from '@/layout/shell/HeaderToolbar.vue';
import { useAppStore } from '@/store/modules/app/app';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import LaySidebarBreadCrumb from '../components/lay-sidebar/components/SidebarBreadCrumb.vue';

import MenuFold from '~icons/ri/menu-fold-fill';
import MenuUnfold from '~icons/ri/menu-unfold-fill';

const { t } = useI18n();
const appStore = useAppStore();
const { capabilities, mode } = useLayoutCapabilities();

const showBreadcrumb = computed(() => capabilities.value.showNavbarBreadcrumb && appStore.device !== 'mobile');

/** 竖/混合顶栏中段槽位（切换时淡入淡出） */
const navbarSlotKey = computed(() => {
  if (capabilities.value.showMixTopMenu) {
    return 'mix-menu';
  }
  if (capabilities.value.showNavbarToolbar) {
    return 'toolbar';
  }
  return 'empty';
});
</script>

<template>
  <div class="layout-navbar bg-white shadow-xs shadow-[rgba(0,21,41,0.08)]">
    <div
      v-if="appStore.device === 'mobile'"
      :title="appStore.sidebar.opened ? t('buttons.clickCollapse') : t('buttons.clickExpand')"
      class="px-3 mr-1 navbar-bg-hover layout-navbar__collapse"
      @click="appStore.toggleSideBar()"
    >
      <IconifyIconOffline
        :icon="appStore.sidebar.opened ? MenuFold : MenuUnfold"
        class="inline-block! align-middle hover:text-primary dark:hover:text-white!"
      />
    </div>

    <Transition mode="out-in" name="layout-chrome">
      <LaySidebarBreadCrumb v-if="showBreadcrumb" :key="`crumb-${mode}`" class="layout-navbar__breadcrumb" />
    </Transition>

    <Transition mode="out-in" name="layout-chrome">
      <MixTopMenu v-if="capabilities.showMixTopMenu" :key="navbarSlotKey" />
      <div v-else-if="capabilities.showNavbarToolbar" :key="navbarSlotKey" class="layout-navbar__toolbar">
        <HeaderToolbar />
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.layout-navbar {
  width: 100%;
  height: 48px;
  overflow: hidden;

  .layout-navbar__collapse {
    float: left;
    height: 100%;
    line-height: 48px;
    cursor: pointer;
  }

  .layout-navbar__toolbar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 280px;
    height: 48px;
    color: var(--auth-text-primary);
  }

  .layout-navbar__breadcrumb {
    float: left;
    margin-left: 16px;
  }
}
</style>
