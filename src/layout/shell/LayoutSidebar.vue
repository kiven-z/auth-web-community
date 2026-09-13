<script lang="ts" setup>
import { useLayoutCapabilities } from '@/layout/hooks/layout/use-layout-capabilities';
import SidebarCollapse from '@/layout/chrome/sidebar/SidebarCollapse.vue';
import { setSidebarOpened } from '@/core/preferences/runtime/actions';
import { getMenuTooltipEffect } from '@/shared/utils/platform';
import { findRouteByPath, getParentPaths } from '@/router/utils/route-tree';
import { useLayoutShellRuntimeStore } from '@/store/modules/layout-shell-runtime';
import { useDisplayPreferencesStore } from '@/store/modules/preferences/display-preferences';
import { usePermissionStore } from '@/store/modules/auth/permission';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import SidebarItem from '@/layout/chrome/sidebar/SidebarItem.vue';
import SidebarLogo from '@/layout/chrome/sidebar/SidebarLogo.vue';

const route = useRoute();
const isShow = ref(false);
const layoutShellStore = useLayoutShellRuntimeStore();
const { capabilities } = useLayoutCapabilities();
const displayStore = useDisplayPreferencesStore();
const { showLogo } = storeToRefs(displayStore);
const isCollapse = computed(() => !layoutShellStore.sidebar.opened);
const tooltipEffect = getMenuTooltipEffect();

const subMenuData = ref([]);

const useMixSidebar = computed(() => capabilities.value.useMixSidebar && layoutShellStore.device !== 'mobile');

const menuData = computed(() => {
  return useMixSidebar.value ? subMenuData.value : usePermissionStore().wholeMenus;
});

const loading = computed(() => (capabilities.value.useMixSidebar ? false : menuData.value.length === 0));

const defaultActive = computed(() => (route.meta?.activePath ? route.meta.activePath : route.path));

/**
 * mix 模式下根据当前路由解析侧栏二级菜单
 */
function getSubMenuData(): void {
  const path = defaultActive.value;
  subMenuData.value = [];
  const parentPathArr = getParentPaths(path, usePermissionStore().wholeMenus);
  const parentRoute = findRouteByPath(parentPathArr[0] || path, usePermissionStore().wholeMenus);
  if (!parentRoute?.children) return;
  subMenuData.value = parentRoute.children;
}

watch(
  () => [route.path, usePermissionStore().wholeMenus],
  () => {
    if (route.path.includes('/redirect')) return;
    getSubMenuData();
  },
  { immediate: true }
);
</script>

<template>
  <div
    v-loading="loading"
    :class="['layout-sidebar', showLogo ? 'layout-sidebar--has-logo' : 'layout-sidebar--no-logo']"
    @mouseenter.prevent="isShow = true"
    @mouseleave.prevent="isShow = false"
  >
    <SidebarLogo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar
      :class="[layoutShellStore.device === 'mobile' ? 'layout-sidebar__scroll--mobile' : 'layout-sidebar__scroll--pc']"
      wrap-class="scrollbar-wrapper"
    >
      <el-menu
        :collapse="isCollapse"
        :collapse-transition="false"
        :default-active="defaultActive"
        :popper-effect="tooltipEffect"
        class="layout-menu__outer"
        mode="vertical"
        popper-class="auth-scrollbar"
        unique-opened
      >
        <SidebarItem
          v-for="menuRoute in menuData"
          :key="menuRoute.path"
          :base-path="menuRoute.path"
          :item="menuRoute"
          class="layout-menu__outer"
        />
      </el-menu>
    </el-scrollbar>
    <SidebarCollapse
      v-if="layoutShellStore.device !== 'mobile' && (isShow || isCollapse)"
      :is-active="layoutShellStore.sidebar.opened"
      variant="center"
      @toggle-click="setSidebarOpened()"
    />
    <SidebarCollapse
      v-if="layoutShellStore.device !== 'mobile'"
      :is-active="layoutShellStore.sidebar.opened"
      variant="left"
      @toggle-click="setSidebarOpened()"
    />
  </div>
</template>

<style lang="scss" scoped>
.layout-menu__outer {
  user-select: none;
}
</style>
