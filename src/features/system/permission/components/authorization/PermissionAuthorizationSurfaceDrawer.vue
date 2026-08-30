<script lang="ts" setup>
import { getPermissionDetail, type SysPermissionDetail } from '@/features/system/api/permission/permission';
import { getPermissionRolesPage } from '@/features/system/api/permission/permission-authorization';
import { errorMessage } from '@/services/feedback/message';
import AuthorizationSurfaceShell from '@/features/system/_shared/components/AuthorizationSurfaceShell.vue';
import SubjectBoundRolesPanel from '@/features/system/_shared/components/SubjectBoundRolesPanel.vue';
import { SYS_PERMISSION_PERMS } from '@/features/system/permission/constants/permissions';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'PermissionAuthorizationSurfaceDrawer' });

/** 权限授权面抽屉入参 */
interface PermissionAuthorizationSurfaceDrawerProps {
  permissionId: string;
}

const props = defineProps<PermissionAuthorizationSurfaceDrawerProps>();

const { t } = useI18n();
const summaryLoading = ref(false);
const detail = ref<SysPermissionDetail | null>(null);

const relationCountItems = computed(() => [
  { label: t('permissions.bound.roles.title'), count: detail.value?.boundRoleCount },
]);

/**
 * 拉取权限详情计数作为授权面摘要
 */
async function loadSummary() {
  summaryLoading.value = true;
  try {
    detail.value = await getPermissionDetail(props.permissionId);
  } catch (error: unknown) {
    errorMessage(error);
    detail.value = null;
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
    <SubjectBoundRolesPanel
      :fetch-page="(query) => getPermissionRolesPage(permissionId, query)"
      :query-perm="SYS_PERMISSION_PERMS.QUERY"
      :title="t('permissions.bound.roles.title')"
    />
  </AuthorizationSurfaceShell>
</template>
