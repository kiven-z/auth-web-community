<script lang="tsx" setup>
import useUserStatus from '@/components/domain/user/user-status';
import UserAvatar from '@/components/domain/user/user-avatar';
import Description from '@/components/ui/description';
import { getUserDetail } from '@/features/system/api/user/user-base';
import { errorMessage } from '@/services/feedback/message';
import { computed, type PropType, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'UserProfile' });

const props = defineProps({
  userId: { type: String as PropType<string | undefined>, required: false },
});

const { t } = useI18n();
const { renderUserAccountStatus } = useUserStatus();

const loading = ref(false);
const userDetailInfo = ref<Record<string, unknown>[]>([]);

const userColumns = computed(() => [
  { label: t('users.field.username'), prop: 'username', copy: true },
  { label: t('users.field.nickname'), prop: 'nickname', copy: true },
  { label: t('users.field.email'), prop: 'email', copy: true },
  { label: t('users.field.phone'), prop: 'phone', copy: true },
  { label: t('relation.employeeNo'), prop: 'employeeNo', copy: true },
  {
    label: t('users.field.avatarURL'),
    prop: 'avatar',
    cellRenderer: ({ value, row }: { value: string; row: { nickname?: string | null; username?: string } }) => (
      <UserAvatar avatar={value} name={row?.nickname || row?.username} size={40} />
    ),
  },
  {
    label: t('users.field.status'),
    prop: 'status',
    cellRenderer: ({ value }: { value: number }) => renderUserAccountStatus(value),
  },
  { label: t('users.field.primaryDeptName'), prop: 'primaryDeptName', span: 2, copy: true },
]);

/**
 * 按 userId 拉取用户身份档案
 */
async function loadUserProfile() {
  if (!props.userId) {
    userDetailInfo.value = [];
    return;
  }

  loading.value = true;
  try {
    const profile = await getUserDetail(props.userId);
    userDetailInfo.value = [profile as unknown as Record<string, unknown>];
  } catch (error: unknown) {
    errorMessage(error);
    userDetailInfo.value = [];
  } finally {
    loading.value = false;
  }
}

watch(
  () => props.userId,
  () => {
    loadUserProfile();
  },
  { immediate: true }
);
</script>

<template>
  <div class="user-profile-container">
    <div class="section">
      <div class="section-header">
        <h3 class="section-title">{{ t('users.section.baseInfo') }}</h3>
        <el-tag type="primary">{{ t('users.section.profile') }}</el-tag>
      </div>
      <Description
        v-loading="loading"
        :column="2"
        :columns="userColumns"
        :data="userDetailInfo"
        border
        class="mb-4 overflow-x-auto"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'index';
</style>
