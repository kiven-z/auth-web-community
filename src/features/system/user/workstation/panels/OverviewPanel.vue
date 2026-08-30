<script lang="tsx" setup>
import { getUserDetail, type SysUserDetail } from '@/features/system/api/user/user-base';
import DetailRelationCountBar from '@/features/system/_shared/components/DetailRelationCountBar.vue';
import { UserAvatar, useUserProfileDisplay } from '@/components/domain/user/UserProfile';
import Description from '@/components/ui/Description';
import { errorMessage } from '@/services/feedback/message';
import { createAuditDetailColumns } from '@/components/table/AuditColumns';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { addDrawer } from '@/components/ui/Drawer';
import UserAuthorizationSurfaceDrawer from '@/features/system/user/workstation/panels/authorization/UserAuthorizationSurfaceDrawer.vue';

defineOptions({
  name: 'UserWorkstationOverviewPanel',
});

const route = useRoute();
const { t } = useI18n();
const loading = ref(false);
const detail = ref<SysUserDetail | null>(null);

const { renderUserAccountStatus, renderUserGender } = useUserProfileDisplay();

const descriptionColumns = computed(() => [
  { label: t('users.field.username'), prop: 'username', labelWidth: 120, copy: true },
  { label: t('users.field.nickname'), prop: 'nickname', labelWidth: 120, copy: true },
  { label: t('users.field.email'), prop: 'email', labelWidth: 120, copy: true },
  { label: t('users.field.phone'), prop: 'phone', labelWidth: 120, copy: true },
  { label: t('relation.employeeNo'), prop: 'employeeNo', labelWidth: 120, copy: true },
  {
    label: t('users.field.avatarURL'),
    prop: 'avatar',
    labelWidth: 120,
    cellRenderer: ({ value, row }: { value: string; row: { nickname?: string | null; username?: string } }) => (
      <UserAvatar avatar={value} name={row?.nickname || row?.username} size={40} />
    ),
  },
  {
    label: t('users.field.status'),
    prop: 'status',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: number }) => renderUserAccountStatus(value),
  },
  {
    label: t('users.field.gender'),
    prop: 'gender',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: number }) => renderUserGender(value),
  },
  { label: t('users.field.birthday'), prop: 'birthday', labelWidth: 120 },
  { label: t('users.field.introduction'), prop: 'introduction', labelWidth: 120, span: 2 },
  { label: t('users.field.remark'), prop: 'remark', labelWidth: 120, span: 2 },
  ...createAuditDetailColumns(),
]);

const relationCountItems = computed(() => [
  { label: t('users.bound.depts.title'), count: detail.value?.deptCount },
  { label: t('users.bound.posts.title'), count: detail.value?.postCount },
  { label: t('users.bound.directRoles.title'), count: detail.value?.directRoleCount },
  { label: t('users.effective.roles.title'), count: detail.value?.effectiveRoleCount },
  { label: t('users.effective.permissions.title'), count: detail.value?.effectivePermissionCount },
]);

/**
 * 打开指定用户的授权面
 * @param options 用户标识与展示名
 */
function openUserAuthorizationSurface(options) {
  const titleSuffix = options.username ? ` · ${options.username}` : '';
  addDrawer({
    title: `${t('users.authorizationSurface.title')}${titleSuffix}`,
    size: '80%',
    resizable: true,
    closeOnClickModal: false,
    hideFooter: true,
    contentRenderer: () => <UserAuthorizationSurfaceDrawer userId={options.userId} />,
  });
}

/**
 * 拉取用户详情
 */
async function loadDetail() {
  const userId = String(route.params.userId ?? '');
  if (!userId) {
    detail.value = null;
    return;
  }

  loading.value = true;
  try {
    detail.value = await getUserDetail(userId);
  } catch (error: unknown) {
    errorMessage(error);
    detail.value = null;
  } finally {
    loading.value = false;
  }
}

watch(
  () => route.params.userId,
  () => void loadDetail(),
  { immediate: true }
);
</script>

<template>
  <div v-loading="loading" class="overview-panel">
    <template v-if="detail">
      <Description :column="2" :columns="descriptionColumns" :data="detail" />

      <el-divider />

      <DetailRelationCountBar
        :items="relationCountItems"
        @view-authorization="
          openUserAuthorizationSurface({ userId: String(route.params.userId ?? ''), username: detail.username })
        "
      />
    </template>
  </div>
</template>
