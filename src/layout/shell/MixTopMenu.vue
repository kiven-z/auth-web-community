<script lang="ts" setup>
import { useRenderIcon } from '@/components/ui/Icon';
import HeaderToolbar from '@/layout/shell/HeaderToolbar.vue';
import { MENU_TITLE_ROW_STYLE, resolveMixMenuIndexPath } from '@/layout/utils/menu-path';
import { transformI18n } from '@/app/plugins/i18n';
import { findRouteByPath, getParentPaths } from '@/router/utils/route-tree';
import { useAppStore } from '@/store/modules/app/app';
import { usePermissionStore } from '@/store/modules/auth/permission';
import { nextTick, onMounted, ref, toRaw, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const appStore = useAppStore();
const menuRef = ref();
const defaultActive = ref(null);

/**
 * 解析 mix 顶栏当前高亮路径
 * @param routePath 当前路由 path
 */
function getDefaultActive(routePath: string): void {
  const wholeMenus = usePermissionStore().wholeMenus;
  const parentRoutes = getParentPaths(routePath, wholeMenus)[0];
  defaultActive.value = route.meta?.activePath
    ? route.meta.activePath
    : findRouteByPath(parentRoutes, wholeMenus)?.children[0]?.path;
}

onMounted(() => {
  getDefaultActive(route.path);
});

nextTick(() => {
  menuRef.value?.handleResize();
});

watch(
  () => [route.path, usePermissionStore().wholeMenus],
  () => {
    getDefaultActive(route.path);
  }
);
</script>

<template>
  <div
    v-if="appStore.device !== 'mobile'"
    v-loading="usePermissionStore().wholeMenus.length === 0"
    class="layout-horizontal"
  >
    <el-menu
      ref="menuRef"
      :default-active="defaultActive"
      class="layout-horizontal__menu"
      mode="horizontal"
      popper-class="auth-scrollbar"
      router
    >
      <el-menu-item
        v-for="menuRoute in usePermissionStore().wholeMenus"
        :key="menuRoute.path"
        :index="resolveMixMenuIndexPath(menuRoute) || menuRoute.redirect"
      >
        <template #title>
          <div v-if="toRaw(menuRoute.meta.icon)" :class="['layout-menu__icon', menuRoute.meta.icon]">
            <component :is="useRenderIcon(menuRoute.meta && toRaw(menuRoute.meta.icon))" />
          </div>
          <div :style="MENU_TITLE_ROW_STYLE">
            <span class="select-none">
              {{ transformI18n(menuRoute.meta.title) }}
            </span>
            <div v-if="menuRoute.meta.extraIcon" class="flex justify-center items-center">
              <component :is="useRenderIcon(toRaw(menuRoute.meta.extraIcon))" class="w-[30px] h-[30px]" />
            </div>
          </div>
        </template>
      </el-menu-item>
    </el-menu>
    <div class="layout-horizontal__toolbar">
      <HeaderToolbar :menu-instance="menuRef" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-loading-mask) {
  opacity: 0.45;
}
</style>
