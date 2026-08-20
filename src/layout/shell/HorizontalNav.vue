<script lang="ts" setup>
import HeaderToolbar from '@/layout/shell/HeaderToolbar.vue';
import { getAppTitle, getLogoUrl } from '@/layout/utils/platform';
import { getUiPreferenceState } from '@/core/preferences/persistence/storage';
import { usePermissionStore } from '@/store/modules/auth/permission';
import { router } from '@/router';
import { getTopMenu } from '@/router/utils/misc';
import { computed, nextTick, ref } from 'vue';
import { useRoute } from 'vue-router';
import LaySidebarItem from '../components/lay-sidebar/components/SidebarItem.vue';

const route = useRoute();
const menuRef = ref();
const preferenceState = getUiPreferenceState();
const showLogo = computed(() => preferenceState.configure?.showLogo ?? true);
const title = getAppTitle();
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
      <img :src="logoUrl" alt="logo" />
      <span>{{ title }}</span>
    </div>
    <el-menu
      ref="menuRef"
      :default-active="defaultActive"
      class="layout-horizontal__menu"
      mode="horizontal"
      popper-class="auth-scrollbar"
    >
      <LaySidebarItem
        v-for="menuRoute in usePermissionStore().wholeMenus"
        :key="menuRoute.path"
        :base-path="menuRoute.path"
        :item="menuRoute"
      />
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
