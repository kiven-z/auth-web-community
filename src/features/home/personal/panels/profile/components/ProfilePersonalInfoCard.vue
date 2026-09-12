<script lang="ts" setup>
import type { SysUserDetail } from '@/features/system/api/user/user-base';
import type { MeOrgBindingsResponse } from '@/features/system/api/user/user-me';
import { updateMyAvatar } from '@/features/system/api/user/user-me';
import AvatarUpdateCard from '@/components/domain/user/avatar-update-card';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'ProfilePersonalInfoCard',
});

const props = defineProps<{
  profile: SysUserDetail;
  orgBindings: MeOrgBindingsResponse | null;
}>();

const emit = defineEmits<{
  avatarUpdated: [avatarUrl: string];
}>();

const { t } = useI18n();

const primaryDeptName = computed(() => {
  const depts = props.orgBindings?.depts;
  if (!depts?.length) {
    return '';
  }
  return depts.find((dept) => dept.isPrimary)?.deptName ?? depts[0].deptName;
});

/**
 * 持久化当前用户头像
 * @param avatarUrl 新头像 URL
 */
async function persistAvatar(avatarUrl: string): Promise<void> {
  await updateMyAvatar({ avatar: avatarUrl });
}
</script>

<template>
  <section class="profile-personal-info-card">
    <AvatarUpdateCard :avatar="profile.avatar" :persist="persistAvatar" @success="emit('avatarUpdated', $event)">
      <template #meta>
        <div class="profile-personal-info-card__summary-content">
          <div class="profile-personal-info-card__name-row">
            <h3 class="profile-personal-info-card__nickname">{{ profile.nickname }}</h3>
            <el-text type="info">@{{ profile.username }}</el-text>
          </div>

          <div v-if="primaryDeptName" class="profile-personal-info-card__meta">
            <el-text class="profile-personal-info-card__primary-dept" truncated type="primary">
              {{ t('account.orgBindings.primaryDept', { name: primaryDeptName }) }}
            </el-text>
          </div>
        </div>
      </template>
    </AvatarUpdateCard>
  </section>
</template>

<style lang="scss" scoped>
.profile-personal-info-card {
  &__summary-content {
    flex: 1;
    min-width: 0;
  }

  &__name-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  &__nickname {
    margin: 0;
    font-size: 18px;
    font-weight: 500;
  }

  &__meta {
    margin-top: 8px;
  }

  &__primary-dept {
    max-width: 100%;
    font-size: 13px;
  }
}
</style>
