<script lang="ts" setup>
import { useLayoutCapabilities } from '@/layout/hooks/layout/use-layout-capabilities';
import MixTopMenu from '@/layout/shell/layout-header/components/MixTopMenu.vue';
import LayoutToolbar from '@/layout/shell/layout-header/components/LayoutToolbar.vue';
import { setSidebarOpened } from '@/core/preferences/runtime/actions';
import { useLayoutShellRuntimeStore } from '@/store/modules/layout-shell-runtime';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import NavbarBreadcrumb from '@/layout/chrome/breadcrumb/NavbarBreadcrumb.vue';

import MenuFold from '~icons/ri/menu-fold-fill';
import MenuUnfold from '~icons/ri/menu-unfold-fill';

const { t } = useI18n();
const layoutShellStore = useLayoutShellRuntimeStore();
const { capabilities, mode } = useLayoutCapabilities();

const showBreadcrumb = computed(() => capabilities.value.showNavbarBreadcrumb && layoutShellStore.device !== 'mobile');

/** 竖/混合顶栏中段槽位（切换时淡入淡出） */
const navbarSlotKey = computed(() => {
  if (capabilities.value.showMixTopMenu) {
    return 'mix-menu';
  }
  if (capabilities.value.showToolbar) {
    return 'toolbar';
  }
  return 'empty';
});
</script>

<template>
  <div class="layout-navbar">
    <div
      v-if="layoutShellStore.device === 'mobile'"
      :title="layoutShellStore.sidebar.opened ? t('buttons.clickCollapse') : t('buttons.clickExpand')"
      class="layout-navbar__collapse layout-toolbar__hover"
      @click="setSidebarOpened()"
    >
      <component
        :is="layoutShellStore.sidebar.opened ? MenuFold : MenuUnfold"
        class="layout-navbar__collapse-icon"
      />
    </div>

    <Transition mode="out-in" name="layout-chrome">
      <NavbarBreadcrumb v-if="showBreadcrumb" :key="`crumb-${mode}`" class="layout-navbar__breadcrumb" />
    </Transition>

    <Transition mode="out-in" name="layout-chrome">
      <MixTopMenu v-if="capabilities.showMixTopMenu" :key="navbarSlotKey" />
      <div v-else-if="capabilities.showToolbar" :key="navbarSlotKey" class="layout-navbar__toolbar">
        <LayoutToolbar />
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.layout-navbar {
  width: 100%;
  height: 48px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);

  &__collapse {
    float: left;
    height: 100%;
    padding: 0 12px;
    margin-right: 4px;
    line-height: 48px;
    cursor: pointer;
  }

  &__collapse-icon {
    display: inline-block;
    vertical-align: middle;

    &:hover {
      color: var(--el-color-primary);
    }

    html.dark &:hover {
      color: #fff;
    }
  }

  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 280px;
    height: 48px;
    color: var(--auth-text-primary);
  }

  &__breadcrumb {
    float: left;
    margin-left: 16px;
  }
}
</style>
