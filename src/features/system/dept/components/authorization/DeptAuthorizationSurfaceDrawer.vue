<script lang="ts" setup>
import { getDeptPostsPage, getDeptRolesPage, getDeptUsersPage } from '@/features/system/api/dept/dept-authorization';
import SubjectBoundRolesPanel from '@/features/system/_shared/components/SubjectBoundRolesPanel.vue';
import SubjectBoundUsersPanel from '@/features/system/_shared/components/SubjectBoundUsersPanel.vue';
import DeptBoundPostsPanel from '@/features/system/dept/components/authorization/DeptBoundPostsPanel.vue';
import { SYS_DEPT_PERMS } from '@/features/system/dept/constants/permissions';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'DeptAuthorizationSurfaceDrawer' });

/** 部门授权面抽屉入参 */
interface DeptAuthorizationSurfaceDrawerProps {
  deptId: string;
}

type AuthorizationSurfaceTab = 'users' | 'posts' | 'roles';

defineProps<DeptAuthorizationSurfaceDrawerProps>();

const { t } = useI18n();
const activeTab = ref<AuthorizationSurfaceTab>('users');
</script>

<template>
  <el-tabs v-model="activeTab">
    <el-tab-pane :label="t('dept.binding.users.title')" lazy name="users">
      <SubjectBoundUsersPanel
        :fetch-page="(query) => getDeptUsersPage(deptId, query)"
        :query-perm="SYS_DEPT_PERMS.QUERY"
        :title="t('dept.binding.users.title')"
      />
    </el-tab-pane>
    <el-tab-pane :label="t('dept.binding.posts.title')" lazy name="posts">
      <DeptBoundPostsPanel
        :fetch-page="(query) => getDeptPostsPage(deptId, query)"
        :query-perm="SYS_DEPT_PERMS.QUERY"
        :title="t('dept.binding.posts.title')"
      />
    </el-tab-pane>
    <el-tab-pane :label="t('dept.binding.roles.title')" lazy name="roles">
      <SubjectBoundRolesPanel
        :fetch-page="(query) => getDeptRolesPage(deptId, query)"
        :query-perm="SYS_DEPT_PERMS.QUERY"
        :title="t('dept.binding.roles.title')"
      />
    </el-tab-pane>
  </el-tabs>
</template>
