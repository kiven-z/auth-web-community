<script lang="ts" setup>
import {
  type DeptAuthorizationSummary,
  getDeptAuthorizationSummary,
  getDeptPostsPage,
  getDeptRolesPage,
  getDeptUsersPage,
} from '@/features/system/api/dept/dept-authorization';
import { errorMessage } from '@/services/feedback/message';
import AuthorizationSurfaceShell from '@/features/system/_shared/components/AuthorizationSurfaceShell.vue';
import SubjectBoundRolesPanel from '@/features/system/_shared/components/SubjectBoundRolesPanel.vue';
import SubjectBoundUsersPanel from '@/features/system/_shared/components/SubjectBoundUsersPanel.vue';
import DeptBoundPostsPanel from '@/features/system/dept/components/authorization/DeptBoundPostsPanel.vue';
import { SYS_DEPT_PERMS } from '@/features/system/dept/constants/permissions';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'DeptAuthorizationSurfaceDrawer' });

/** 部门授权面抽屉入参 */
interface DeptAuthorizationSurfaceDrawerProps {
  deptId: string;
}

type AuthorizationSurfaceTab = 'users' | 'posts' | 'roles';

const props = defineProps<DeptAuthorizationSurfaceDrawerProps>();

const { t } = useI18n();
const summaryLoading = ref(false);
const summary = ref<DeptAuthorizationSummary | null>(null);
const activeTab = ref<AuthorizationSurfaceTab>('users');

const relationCountItems = computed(() => [
  { label: t('dept.binding.users.title'), count: summary.value?.boundUserCount },
  { label: t('dept.binding.posts.title'), count: summary.value?.boundPostCount },
  { label: t('dept.binding.roles.title'), count: summary.value?.boundRoleCount },
]);

/**
 * 拉取部门授权面摘要计数
 */
async function loadSummary() {
  summaryLoading.value = true;
  try {
    summary.value = await getDeptAuthorizationSummary(props.deptId);
  } catch (error: unknown) {
    errorMessage(error);
    summary.value = null;
  } finally {
    summaryLoading.value = false;
  }
}

onMounted(() => {
  void loadSummary();
});
</script>

<template>
  <AuthorizationSurfaceShell :items="relationCountItems" :loading="summaryLoading">
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
  </AuthorizationSurfaceShell>
</template>
