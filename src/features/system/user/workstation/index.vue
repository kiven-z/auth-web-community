<script lang="ts" setup>
import WorkspaceShell from '@/components/layout/workspace-shell';
import { getUserProfile, type SysUserProfileResponse } from '@/features/system/api/user/user-base';
import useWorkstationNav, {
  USER_WORKSTATION_DEFAULT_SECTION,
} from '@/features/system/user/workstation/hooks/shell/use-workstation-nav';
import { resolveWorkstationBackTarget } from '@/features/system/user/workstation/hooks/shell/resolve-workstation-back-target';
import { WORKSTATION_PROFILE_KEY } from '@/features/system/user/workstation/hooks/shell/use-workstation-profile-context';
import { errorMessage } from '@/services/feedback/message';
import { computed, provide, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

defineOptions({
  name: 'UserWorkstation',
});

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { navGroups } = useWorkstationNav();

const loading = ref(true);
const profile = ref<SysUserProfileResponse | null>(null);
const loadFailed = ref(false);

const userId = computed(() => String(route.params.userId ?? ''));

/** 当前侧栏分区：读 route.meta.section */
const activeSection = computed(() =>
  typeof route.meta.section === 'string' && route.meta.section ? route.meta.section : USER_WORKSTATION_DEFAULT_SECTION
);

const displayName = computed(() => {
  if (loading.value) {
    return t('users.workstation.loadingName');
  }
  const row = profile.value;
  if (!row) {
    return t('users.workstation.unknownUser');
  }
  return row.nickname || row.username;
});

const subtitle = computed(() => {
  if (loading.value || !profile.value) {
    return '';
  }
  return profile.value.username;
});

const subtitleHint = computed(() => (loadFailed.value ? t('users.workstation.loadFailedHint') : ''));

/**
 * 合并更新壳层档案（资料 / 头像变更后由子面板调用）
 * @param patch 局部字段
 */
function patchProfile(patch: Partial<SysUserProfileResponse>) {
  if (!profile.value) {
    return;
  }
  profile.value = { ...profile.value, ...patch };
}

provide(WORKSTATION_PROFILE_KEY, { profile, patchProfile });

/**
 * 拉取工作台顶部展示用的用户档案
 */
async function loadProfile() {
  if (!userId.value) {
    loading.value = false;
    loadFailed.value = true;
    profile.value = null;
    return;
  }

  loading.value = true;
  loadFailed.value = false;
  try {
    profile.value = await getUserProfile(userId.value);
  } catch (error: unknown) {
    errorMessage(error);
    profile.value = null;
    loadFailed.value = true;
  } finally {
    loading.value = false;
  }
}

/**
 * 返回用户列表：优先来源页，否则 SystemUser，再否则首页
 */
async function handleBack() {
  const target = resolveWorkstationBackTarget(history.state?.UserWorkstation, router.hasRoute('SystemUser'));
  await router.push(target);
}

/**
 * 侧栏选中：跳转工作台子路由
 * @param index 分区键
 */
async function handleSelect(index: string) {
  await router.push(`/system/user-workstation/${userId.value}/${index}`);
}

watch(
  userId,
  () => {
    void loadProfile();
  },
  { immediate: true }
);
</script>

<template>
  <WorkspaceShell
    :active-section="activeSection"
    :avatar="profile?.avatar"
    :back-label="t('users.workstation.back')"
    :display-name="displayName"
    :loading="loading"
    :nav-groups="navGroups"
    :subtitle="subtitle"
    :subtitle-hint="subtitleHint"
    @back="handleBack"
    @select="handleSelect"
  />
</template>
