<script lang="ts" setup>
import { getMenuDetail, type SysMenuDetailVO } from '@/features/system/api/menu/menu';
import { getMenuRolesPage } from '@/features/system/api/menu/menu-authorization';
import { errorMessage } from '@/services/feedback/message';
import AuthorizationSurfaceShell from '@/features/system/_shared/components/AuthorizationSurfaceShell.vue';
import SubjectBoundRolesPanel from '@/features/system/_shared/components/SubjectBoundRolesPanel.vue';
import { SYS_MENU_PERMS } from '@/features/system/menu/constants/permissions';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'MenuAuthorizationSurfaceDrawer' });

/** 菜单授权面抽屉入参 */
interface MenuAuthorizationSurfaceDrawerProps {
  menuId: string;
}

const props = defineProps<MenuAuthorizationSurfaceDrawerProps>();

const { t } = useI18n();
const summaryLoading = ref(false);
const detail = ref<SysMenuDetailVO | null>(null);

const relationCountItems = computed(() => [
  { label: t('sysMenu.bound.roles.title'), count: detail.value?.boundRoleCount },
]);

/**
 * 拉取菜单详情计数作为授权面摘要
 */
async function loadSummary() {
  summaryLoading.value = true;
  try {
    detail.value = await getMenuDetail(props.menuId);
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
      :fetch-page="(query) => getMenuRolesPage(menuId, query)"
      :query-perm="SYS_MENU_PERMS.QUERY"
      :title="t('sysMenu.bound.roles.title')"
    />
  </AuthorizationSurfaceShell>
</template>
