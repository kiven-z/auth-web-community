<script lang="ts" setup>
import {
  getUserEffectivePermissionsPage,
  getUserEffectiveRolesPage,
} from '@/features/system/api/user/user-authorization';
import { getUserDeptPage } from '@/features/system/api/user/user-dept';
import { getUserPostPage } from '@/features/system/api/user/user-post';
import { getUserRolePage } from '@/features/system/api/user/user-role';
import SubjectBoundRolesPanel from '@/features/system/_shared/components/SubjectBoundRolesPanel.vue';
import UserBoundDeptsPanel from '@/features/system/user/workstation/panels/authorization/UserBoundDeptsPanel.vue';
import UserBoundPostsPanel from '@/features/system/user/workstation/panels/authorization/UserBoundPostsPanel.vue';
import UserEffectivePermissionsPanel from '@/features/system/user/workstation/panels/authorization/UserEffectivePermissionsPanel.vue';
import UserEffectiveRolesPanel from '@/features/system/user/workstation/panels/authorization/UserEffectiveRolesPanel.vue';
import {
  SYS_USER_DEPT_PERMS,
  SYS_USER_PERMS,
  SYS_USER_POST_PERMS,
  SYS_USER_ROLE_PERMS,
} from '@/features/system/user/constants/permissions';
import useUserSecurityAction from '@/features/system/user/workstation/hooks/security/use-user-security-action';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'UserAuthorizationSurfaceDrawer' });

/** 用户授权面抽屉入参 */
interface UserAuthorizationSurfaceDrawerProps {
  userId: string;
}

type AuthorizationSurfaceTab = 'depts' | 'posts' | 'directRoles' | 'effectiveRoles' | 'effectivePermissions';

const props = defineProps<UserAuthorizationSurfaceDrawerProps>();

const { t } = useI18n();
const { refreshUserAuth } = useUserSecurityAction();
const refreshLoading = ref(false);
const activeTab = ref<AuthorizationSurfaceTab>('depts');

/**
 * 刷新当前用户授权画像
 */
async function handleRefreshAuth() {
  refreshLoading.value = true;
  try {
    await refreshUserAuth(props.userId);
  } finally {
    refreshLoading.value = false;
  }
}
</script>

<template>
  <div class="mb-3 flex justify-end">
    <el-button v-auth="SYS_USER_PERMS.AUTH_REFRESH" :loading="refreshLoading" type="warning" @click="handleRefreshAuth">
      {{ t('users.workstation.security.authRefresh') }}
    </el-button>
  </div>

  <el-tabs v-model="activeTab">
    <el-tab-pane :label="t('users.bound.depts.title')" lazy name="depts">
      <UserBoundDeptsPanel
        :fetch-page="(query) => getUserDeptPage(userId, query)"
        :query-perm="SYS_USER_DEPT_PERMS.QUERY"
        :title="t('users.bound.depts.title')"
      />
    </el-tab-pane>
    <el-tab-pane :label="t('users.bound.posts.title')" lazy name="posts">
      <UserBoundPostsPanel
        :fetch-page="(query) => getUserPostPage(userId, query)"
        :query-perm="SYS_USER_POST_PERMS.QUERY"
        :title="t('users.bound.posts.title')"
      />
    </el-tab-pane>
    <el-tab-pane :label="t('users.bound.directRoles.title')" lazy name="directRoles">
      <SubjectBoundRolesPanel
        :fetch-page="(query) => getUserRolePage(userId, query)"
        :query-perm="SYS_USER_ROLE_PERMS.QUERY"
        :title="t('users.bound.directRoles.title')"
      />
    </el-tab-pane>
    <el-tab-pane :label="t('users.effective.roles.title')" lazy name="effectiveRoles">
      <UserEffectiveRolesPanel
        :fetch-page="(query) => getUserEffectiveRolesPage(userId, query)"
        :query-perm="SYS_USER_PERMS.QUERY"
        :title="t('users.effective.roles.title')"
      />
    </el-tab-pane>
    <el-tab-pane :label="t('users.effective.permissions.title')" lazy name="effectivePermissions">
      <UserEffectivePermissionsPanel
        :fetch-page="(query) => getUserEffectivePermissionsPage(userId, query)"
        :query-perm="SYS_USER_PERMS.QUERY"
        :title="t('users.effective.permissions.title')"
      />
    </el-tab-pane>
  </el-tabs>
</template>
