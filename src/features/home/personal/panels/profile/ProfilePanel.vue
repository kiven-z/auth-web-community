<script lang="ts" setup>
import { readStoredUserProfileEntry, writeUserProfileToStorage } from '@/core/session/profile/user-profile-storage';
import { getUserDetail, type SysUserDetail } from '@/features/system/api/user/user-base';
import {
  getMyOrgBindings,
  type MeOrgBindingsResponse,
  type MeProfileUpdateRequest,
} from '@/features/system/api/user/user-me';
import { errorMessage } from '@/services/feedback/message';
import { useUserStore } from '@/store/modules/auth/user';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ProfileBasicInfoCard from './components/ProfileBasicInfoCard.vue';
import ProfileOrgBindingsCard from './components/ProfileOrgBindingsCard.vue';
import ProfilePersonalInfoCard from './components/ProfilePersonalInfoCard.vue';

defineOptions({
  name: 'PersonalProfilePanel',
});

const { t } = useI18n();
const userStore = useUserStore();

const loading = ref(false);
const profile = ref<SysUserDetail | null>(null);
const orgBindings = ref<MeOrgBindingsResponse | null>(null);

/**
 * 拉取个人档案与组织任职
 */
async function loadProfileData() {
  loading.value = true;
  try {
    const [nextProfile, nextBindings] = await Promise.all([getUserDetail(userStore.userId), getMyOrgBindings()]);
    profile.value = nextProfile;
    orgBindings.value = nextBindings;
  } catch (error: unknown) {
    errorMessage(error);
    profile.value = null;
    orgBindings.value = null;
  } finally {
    loading.value = false;
  }
}

/**
 * 同步 Store 与本地缓存
 */
function syncStoreAndCache(updates: { nickname?: string; avatar?: string | null }) {
  if (updates.nickname !== undefined) {
    userStore.nickname = updates.nickname;
  }
  if (updates.avatar !== undefined) {
    userStore.avatar = updates.avatar ?? '';
  }

  const stored = readStoredUserProfileEntry();
  if (stored) {
    writeUserProfileToStorage(
      {
        avatar: userStore.avatar,
        username: stored.username ?? userStore.username,
        nickname: userStore.nickname,
        primaryDeptId: stored.primaryDeptId ?? userStore.primaryDeptId ?? '',
        primaryDeptName: stored.primaryDeptName ?? userStore.primaryDeptName ?? '',
        roles: stored.roles ?? userStore.roles,
        permissions: stored.permissions ?? userStore.permissions,
        userId: stored.userId ?? userStore.userId,
      },
      stored.expires ?? 0
    );
  }
}

/**
 * 资料保存成功后合并本地档案
 */
function handleProfileSaved(updated: MeProfileUpdateRequest) {
  if (!profile.value) {
    return;
  }

  profile.value = { ...profile.value, ...updated };
  syncStoreAndCache({ nickname: updated.nickname });
}

/**
 * 头像更新成功后同步展示
 */
function handleAvatarUpdated(avatarUrl: string) {
  if (!profile.value) {
    return;
  }

  profile.value = { ...profile.value, avatar: avatarUrl };
  syncStoreAndCache({ avatar: avatarUrl });
}

onMounted(() => {
  loadProfileData();
});
</script>

<template>
  <div v-loading="loading" class="account-profile">
    <template v-if="profile">
      <el-divider content-position="left">{{ t('account.profile') }}</el-divider>
      <ProfilePersonalInfoCard :org-bindings="orgBindings" :profile="profile" @avatar-updated="handleAvatarUpdated" />

      <template v-if="orgBindings">
        <el-divider content-position="left">{{ t('account.orgBindings.title') }}</el-divider>
        <ProfileOrgBindingsCard :bindings="orgBindings" />
      </template>

      <el-divider content-position="left">{{ t('account.field.basicInfo') }}</el-divider>
      <ProfileBasicInfoCard :profile="profile" @saved="handleProfileSaved" />
    </template>
    <el-empty v-else-if="!loading" :description="t('tips.requestFailed')" />
  </div>
</template>

<style lang="scss" scoped>
.account-profile {
  min-height: 120px;

  > :not(:last-child) {
    margin-bottom: 24px;
  }
}
</style>
