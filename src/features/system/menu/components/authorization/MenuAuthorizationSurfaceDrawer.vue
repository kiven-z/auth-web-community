<script lang="ts" setup>
import { getMenuRolesPage } from '@/features/system/api/menu/menu-authorization';
import SubjectBoundRolesPanel from '@/features/system/_shared/components/SubjectBoundRolesPanel.vue';
import { SYS_MENU_PERMS } from '@/features/system/menu/constants/permissions';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'MenuAuthorizationSurfaceDrawer' });

/** 菜单授权面抽屉入参 */
interface MenuAuthorizationSurfaceDrawerProps {
  menuId: string;
}

defineProps<MenuAuthorizationSurfaceDrawerProps>();

const { t } = useI18n();
</script>

<template>
  <SubjectBoundRolesPanel
    :fetch-page="(query) => getMenuRolesPage(menuId, query)"
    :query-perm="SYS_MENU_PERMS.QUERY"
    :title="t('sysMenu.bound.roles.title')"
  />
</template>
