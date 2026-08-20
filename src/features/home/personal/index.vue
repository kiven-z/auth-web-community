<script lang="ts" setup>
import WorkspaceShell from '@/components/layout/WorkspaceShell';
import { resolvePersonalBackTarget } from '@/features/home/personal/hooks/resolvePersonalBackTarget';
import usePersonalNav, { PERSONAL_DEFAULT_SECTION } from '@/features/home/personal/hooks/usePersonalNav';
import { useUserStore } from '@/store/modules/auth/user';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

defineOptions({
  name: 'PersonalWorkspace',
});

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { navGroups } = usePersonalNav();

/** 当前侧栏分区：读 route.meta.section */
const activeSection = computed(() =>
  typeof route.meta.section === 'string' && route.meta.section ? route.meta.section : PERSONAL_DEFAULT_SECTION
);

const displayName = computed(() => userStore.nickname || userStore.username || t('personal.unknownUser'));

const subtitle = computed(() => {
  if (!userStore.username) {
    return '';
  }
  if (userStore.nickname && userStore.nickname !== userStore.username) {
    return userStore.username;
  }
  return userStore.primaryDeptName ?? '';
});

/**
 * 返回打开个人空间前的来源页；无记录时回首页
 */
async function handleBack() {
  await router.push(resolvePersonalBackTarget(history.state?.Personal));
}

/**
 * 侧栏选中：按分区键跳转子路由
 * @param index 分区键
 */
async function handleSelect(index: string) {
  await router.push(`/personal/${index}`);
}
</script>

<template>
  <WorkspaceShell
    :active-section="activeSection"
    :avatar="userStore.avatar"
    :back-label="t('personal.back')"
    :display-name="displayName"
    :menu-remount-key="activeSection"
    :nav-groups="navGroups"
    :subtitle="subtitle"
    @back="handleBack"
    @select="handleSelect"
  />
</template>
