<script lang="ts" setup>
import { getLocaleDef } from '@/core/config/localeConfig';
import { AuthDialog, closeAllDialog } from '@/components/ui/Dialog';
import { AuthDrawer, closeAllDrawer } from '@/components/ui/Drawer';
import SessionWatermark from '@/components/layout/SessionWatermark';
import { useLocalePreferencesStore } from '@/store/modules/preferences/localePreferences';
import { ElConfigProvider } from 'element-plus';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'App',
  inheritAttrs: false,
});

const router = useRouter();
const localePreferencesStore = useLocalePreferencesStore();
const { locale } = storeToRefs(localePreferencesStore);

router.beforeEach(() => {
  closeAllDialog();
  closeAllDrawer();
});

const currentLocale = computed(() => getLocaleDef(locale.value).el);

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
