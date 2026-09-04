<script lang="ts" setup>
import { APP_TITLE } from '@/core/config/app-config';
import LayoutToolbar from '@/layout/shell/layout-header/components/LayoutToolbar.vue';
import { getLogoUrl } from '@/shared/utils/platform';
import { router } from '@/router';
import { getTopMenu } from '@/router/utils/misc';
import { useDisplayPreferencesStore } from '@/store/modules/preferences/display-preferences';
import { usePermissionStore } from '@/store/modules/auth/permission';
import { storeToRefs } from 'pinia';
import { computed, nextTick, ref } from 'vue';
import { useRoute } from 'vue-router';
import SidebarItem from '@/layout/chrome/sidebar/SidebarItem.vue';

const route = useRoute();
const menuRef = ref();
const displayStore = useDisplayPreferencesStore();
const { showLogo } = storeToRefs(displayStore);
const logoUrl = getLogoUrl();

const defaultActive = computed(() => (route.meta?.activePath ? route.meta.activePath : route.path));

/**
 * 回到顶层菜单路由
 */
function backTopMenu(): void {
  const path = getTopMenu()?.path;
  router.push(path);
}

nextTick(() => {
  menuRef.value?.handleResize();
});
</script>

<template>
  <div v-loading="usePermissionStore().wholeMenus.length === 0" class="layout-horizontal">
    <div v-if="showLogo" class="layout-horizontal__logo" @click="backTopMenu">
      <img :src="logoUrl" alt="logo" class="layout-horizontal__logo-img" />
      <span class="layout-horizontal__logo-title">{{ APP_TITLE }}</span>
    </div>
    <el-menu
      ref="menuRef"
      :default-active="defaultActive"
      class="layout-horizontal__menu"
      mode="horizontal"
      popper-class="auth-scrollbar"
    >
      <SidebarItem
        v-for="menuRoute in usePermissionStore().wholeMenus"
        :key="menuRoute.path"
        :base-path="menuRoute.path"
        :item="menuRoute"
      />
    </el-menu>
    <div class="layout-horizontal__toolbar">
      <LayoutToolbar :menu-instance="menuRef" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-horizontal {
  :deep(.el-loading-mask) {
    opacity: 0.45;
  }
}
</style>
