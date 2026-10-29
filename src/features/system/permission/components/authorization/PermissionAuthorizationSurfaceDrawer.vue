<script lang="ts" setup>
import { getPermissionRolesPage } from '@/features/system/api/permission/permission-authorization';
import SubjectBoundRolesPanel from '@/features/system/_shared/components/SubjectBoundRolesPanel.vue';
import { SYS_PERMISSION_PERMS } from '@/features/system/permission/constants/permissions';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'PermissionAuthorizationSurfaceDrawer' });

/** 权限授权面抽屉入参 */
interface PermissionAuthorizationSurfaceDrawerProps {
  permissionId: string;
}

defineProps<PermissionAuthorizationSurfaceDrawerProps>();

const { t } = useI18n();
</script>

<template>
  <SubjectBoundRolesPanel
    :fetch-page="(query) => getPermissionRolesPage(permissionId, query)"
    :query-perm="SYS_PERMISSION_PERMS.QUERY"
    :title="t('permissions.bound.roles.title')"
  />
</template>
