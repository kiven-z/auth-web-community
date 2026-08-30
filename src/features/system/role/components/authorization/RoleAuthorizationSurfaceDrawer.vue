<script lang="ts" setup>
import {
  getRoleAuthorizationSummary,
  getRoleMenusPage,
  getRolePermissionsPage,
  type RoleAuthorizationSummary,
} from '@/features/system/api/role/roleAuthorization';
import { errorMessage } from '@/services/feedback/message';
import AuthorizationSurfaceShell from '@/features/system/_shared/components/AuthorizationSurfaceShell.vue';
import RoleBoundMenusPanel from '@/features/system/role/components/authorization/RoleBoundMenusPanel.vue';
import RoleBoundPermissionsPanel from '@/features/system/role/components/authorization/RoleBoundPermissionsPanel.vue';
import { SYS_ROLE_PERMS } from '@/features/system/role/constants/permissions';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'RoleAuthorizationSurfaceDrawer' });

/** 角色授权面抽屉入参 */
interface RoleAuthorizationSurfaceDrawerProps {
  roleId: string;
}

type AuthorizationSurfaceTab = 'permissions' | 'menus';

const props = defineProps<RoleAuthorizationSurfaceDrawerProps>();

const { t } = useI18n();
const summaryLoading = ref(false);
const summary = ref<RoleAuthorizationSummary | null>(null);
const activeTab = ref<AuthorizationSurfaceTab>('permissions');

const relationCountItems = computed(() => [
  { label: t('roles.bound.permissionsTitle'), count: summary.value?.permissionCount },
  { label: t('roles.bound.menus.title'), count: summary.value?.menuCount },
]);

/**
 * 拉取授权面摘要计数
 */
async function loadSummary() {
  summaryLoading.value = true;
  try {
    summary.value = await getRoleAuthorizationSummary(props.roleId);
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
    </el-tabs>
  </AuthorizationSurfaceShell>
</template>
