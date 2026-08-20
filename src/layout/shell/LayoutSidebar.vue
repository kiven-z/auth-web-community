<script lang="ts" setup>
import { useLayoutCapabilities } from '@/layout/hooks/layout/useLayoutCapabilities';
import SidebarCollapse from '@/layout/menu/SidebarCollapse.vue';
import { getMenuTooltipEffect } from '@/layout/utils/platform';
import { findRouteByPath, getParentPaths } from '@/router/utils/route-tree';
import { getUiPreferenceState } from '@/core/preferences/persistence/storage';
import { useAppStore } from '@/store/modules/app/app';
import { usePermissionStore } from '@/store/modules/auth/permission';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import LaySidebarItem from '../components/lay-sidebar/components/SidebarItem.vue';
import LaySidebarLogo from '../components/lay-sidebar/components/SidebarLogo.vue';

const route = useRoute();
const isShow = ref(false);
const appStore = useAppStore();
const { capabilities } = useLayoutCapabilities();
const preferenceState = getUiPreferenceState();
const showLogo = computed(() => preferenceState.configure?.showLogo ?? true);
const isCollapse = computed(() => !appStore.getSidebarStatus);
const tooltipEffect = getMenuTooltipEffect();

const subMenuData = ref([]);

const useMixSideMenu = computed(() => capabilities.value.useMixSideMenu && appStore.device !== 'mobile');

const menuData = computed(() => {
  return useMixSideMenu.value ? subMenuData.value : usePermissionStore().wholeMenus;
});

const loading = computed(() => (capabilities.value.useMixSideMenu ? false : menuData.value.length === 0));

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
    <LaySidebarLogo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar
      :class="[appStore.device === 'mobile' ? 'layout-sidebar__scroll--mobile' : 'layout-sidebar__scroll--pc']"
      wrap-class="scrollbar-wrapper"
    >
      <el-menu
        :collapse="isCollapse"
        :collapse-transition="false"
        :default-active="defaultActive"
        :popper-effect="tooltipEffect"
        class="layout-menu__outer select-none"
        mode="vertical"
        popper-class="auth-scrollbar"
        unique-opened
      >
        <LaySidebarItem
          v-for="menuRoute in menuData"
          :key="menuRoute.path"
          :base-path="menuRoute.path"
          :item="menuRoute"
          class="layout-menu__outer select-none"
        />
      </el-menu>
    </el-scrollbar>
    <SidebarCollapse
      v-if="appStore.device !== 'mobile' && (isShow || isCollapse)"
      :is-active="appStore.sidebar.opened"
      variant="center"
      @toggle-click="appStore.toggleSideBar()"
    />
    <SidebarCollapse
      v-if="appStore.device !== 'mobile'"
      :is-active="appStore.sidebar.opened"
      variant="left"
      @toggle-click="appStore.toggleSideBar()"
    />
  </div>
</template>

<style scoped>
:deep(.el-loading-mask) {
  opacity: 0.45;
}
</style>
