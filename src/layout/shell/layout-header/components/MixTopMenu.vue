<script lang="ts" setup>
import { useRenderIcon } from '@/components/ui/icon';
import LayoutToolbar from '@/layout/shell/layout-header/components/LayoutToolbar.vue';
import { resolveMixMenuIndexPath } from '@/layout/utils/menu-path';
import { transformI18n } from '@/app/plugins/i18n';
import { findRouteByPath, getParentPaths } from '@/router/utils/route-tree';
import { useLayoutShellRuntimeStore } from '@/store/modules/layout-shell-runtime';
import { usePermissionStore } from '@/store/modules/auth/permission';
import { nextTick, onMounted, ref, toRaw, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const layoutShellStore = useLayoutShellRuntimeStore();
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
    v-if="layoutShellStore.device !== 'mobile'"
    v-loading="usePermissionStore().wholeMenus.length === 0"
    class="layout-mix-menu"
  >
    <el-menu
      ref="menuRef"
      :default-active="defaultActive"
      class="layout-mix-menu__menu"
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
          <div class="layout-menu__title-row">
            <span class="layout-menu__title-text">
              {{ transformI18n(menuRoute.meta.title) }}
            </span>
            <div v-if="menuRoute.meta.extraIcon" class="layout-menu__extra">
              <component :is="useRenderIcon(toRaw(menuRoute.meta.extraIcon))" class="layout-menu__extra-icon" />
            </div>
          </div>
        </template>
      </el-menu-item>
    </el-menu>
    <div class="layout-mix-menu__toolbar">
      <LayoutToolbar :menu-instance="menuRef" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-mix-menu {
  :deep(.el-loading-mask) {
    opacity: 0.45;
  }
}

.layout-menu__title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  overflow: hidden;
}

.layout-menu__title-text {
  user-select: none;
}

.layout-menu__extra {
  display: flex;
  align-items: center;
  justify-content: center;
}

.layout-menu__extra-icon {
  width: 30px;
  height: 30px;
}
</style>
