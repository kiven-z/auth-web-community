<script lang="ts" setup>
import AuthorizationSurfaceShell from '@/features/system/_shared/components/AuthorizationSurfaceShell.vue';
import {
  getRoleGrantSubjectsPage,
  getRoleMenusPage,
  getRolePermissionsPage,
} from '@/features/system/api/role/role-authorization';
import RoleBoundMenusPanel from '@/features/system/role/components/authorization/RoleBoundMenusPanel.vue';
import RoleBoundPermissionsPanel from '@/features/system/role/components/authorization/RoleBoundPermissionsPanel.vue';
import RoleGrantSeedPanel from '@/features/system/role/components/authorization/RoleGrantSeedPanel.vue';
import { SYS_ROLE_PERMS } from '@/features/system/role/constants/permissions';
import useOpenRoleImpactAnalysis from '@/features/system/role/hooks/impact/use-open-role-impact-analysis';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'RoleAuthorizationSurfaceDrawer' });

/** 角色授权面抽屉入参 */
interface RoleAuthorizationSurfaceDrawerProps {
  roleId: string;
  roleCode: string;
  roleName: string;
}

const props = defineProps<RoleAuthorizationSurfaceDrawerProps>();

const { t } = useI18n();
const { openRoleImpactAnalysis } = useOpenRoleImpactAnalysis();
const activeTab = ref('permissions');
</script>

<template>
  <AuthorizationSurfaceShell>
    <template #actions>
      <el-button
        v-auth="SYS_ROLE_PERMS.QUERY"
        type="warning"
        @click="openRoleImpactAnalysis({ roleId, roleCode, roleName })"
      >
        {{ t('roles.menu.impactAnalysis') }}
      </el-button>
    </template>

    <el-tabs v-model="activeTab">
      <el-tab-pane :label="t('roles.bound.permissionsTitle')" lazy name="permissions">
        <RoleBoundPermissionsPanel
          :fetch-page="(query) => getRolePermissionsPage(roleId, query)"
          :query-perm="SYS_ROLE_PERMS.QUERY"
          :title="t('roles.bound.permissionsTitle')"
        />
      </el-tab-pane>

      <el-tab-pane :label="t('roles.bound.menus.title')" lazy name="menus">
        <RoleBoundMenusPanel
          :fetch-page="(query) => getRoleMenusPage(roleId, query)"
          :query-perm="SYS_ROLE_PERMS.QUERY"
          :title="t('roles.bound.menus.title')"
        />
      </el-tab-pane>
      <el-tab-pane :label="t('roles.bound.users.title')" lazy name="grantUsers">
        <RoleGrantSeedPanel
          :fetch-page="(query) => getRoleGrantSubjectsPage(roleId, { ...query, subjectType: 'USER' })"
          :query-perm="SYS_ROLE_PERMS.QUERY"
          :title="t('roles.bound.users.title')"
        />
      </el-tab-pane>
      <el-tab-pane :label="t('roles.bound.depts.title')" lazy name="grantDepts">
        <RoleGrantSeedPanel
          :fetch-page="(query) => getRoleGrantSubjectsPage(roleId, { ...query, subjectType: 'DEPT' })"
          :query-perm="SYS_ROLE_PERMS.QUERY"
          :title="t('roles.bound.depts.title')"
        />
      </el-tab-pane>
      <el-tab-pane :label="t('roles.bound.posts.title')" lazy name="grantPosts">
        <RoleGrantSeedPanel
          :fetch-page="(query) => getRoleGrantSubjectsPage(roleId, { ...query, subjectType: 'POST' })"
          :query-perm="SYS_ROLE_PERMS.QUERY"
          :title="t('roles.bound.posts.title')"
        />
      </el-tab-pane>
    </el-tabs>
  </AuthorizationSurfaceShell>
</template>
