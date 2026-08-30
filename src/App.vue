<script lang="ts" setup>
import { getLocaleDef } from '@/auth/config/locales';
import { AuthDialog, closeAllDialog } from '@/components/ui/Dialog';
import { AuthDrawer, closeAllDrawer } from '@/components/ui/Drawer';
import { getUiPreferenceState } from '@/core/preferences/persistence/storage';
import SessionWatermark from '@/components/layout/SessionWatermark';
import { ElConfigProvider } from 'element-plus';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'App',
  inheritAttrs: false,
});

const router = useRouter();
const preferenceState = getUiPreferenceState();

router.beforeEach(() => {
  closeAllDialog();
  closeAllDrawer();
});

const currentLocale = computed(() => getLocaleDef(preferenceState.locale?.locale).el);

/** 仅一级路由切换动画，避免 Layout 内菜单跳转整页重挂 */
function topLevelRouteKey(route: { matched: { path: string }[]; path: string }): string {
  return route.matched[0]?.path ?? route.path;
}
</script>

<template>
  <el-config-provider :locale="currentLocale">
    <router-view v-slot="{ Component, route }">
      <Transition mode="out-in" name="fade-transform">
        <component :is="Component" :key="topLevelRouteKey(route)" />
      </Transition>
    </router-view>
    <!-- 与路由树并列的全局水印浮层，不包裹业务 DOM -->
    <SessionWatermark />
    <AuthDialog />
    <AuthDrawer />
  </el-config-provider>
</template>
