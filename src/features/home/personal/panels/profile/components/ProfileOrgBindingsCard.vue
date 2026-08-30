<script lang="ts" setup>
import type { MeOrgBindingsResponse } from '@/features/system/api/user/userMe';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'ProfileOrgBindingsCard',
});

defineProps<{
  bindings: MeOrgBindingsResponse;
}>();

const { t } = useI18n();

/**
 * 启用状态文案
 * @param status 是否启用
 */
function statusLabel(status: boolean | undefined): string {
  return status ? t('buttons.statusActiveText') : t('buttons.statusInactiveText');
}
</script>

<template>
  <section class="profile-org-bindings-card">
    <!-- 部门列 -->
    <div class="profile-org-bindings-card__column">
      <header class="profile-org-bindings-card__header">
        <h4 class="profile-org-bindings-card__title">{{ t('account.orgBindings.depts') }}</h4>
        <span v-if="bindings.depts.length > 0" class="profile-org-bindings-card__count">
          {{ bindings.depts.length }}
        </span>
      </header>

      <ul v-if="bindings.depts.length > 0" class="profile-org-bindings-card__list">
        <li v-for="dept in bindings.depts" :key="dept.id" class="profile-org-bindings-card__item">
          <div class="profile-org-bindings-card__item-main">
            <span class="profile-org-bindings-card__name">{{ dept.deptName }}</span>
            <el-tag v-if="dept.isPrimary" effect="light" size="small" type="primary">
              {{ t('account.orgBindings.primaryMark') }}
            </el-tag>
          </div>

          <p class="profile-org-bindings-card__meta">{{ dept.deptCode }} · {{ statusLabel(dept.status) }}</p>
        </li>
      </ul>
      <el-text v-else type="info">{{ t('account.orgBindings.emptyDepts') }}</el-text>
    </div>

    <!-- 岗位列 -->
    <div class="profile-org-bindings-card__column">
      <header class="profile-org-bindings-card__header">
        <h4 class="profile-org-bindings-card__title">{{ t('account.orgBindings.posts') }}</h4>
        <span v-if="bindings.posts.length > 0" class="profile-org-bindings-card__count">
          {{ bindings.posts.length }}
        </span>
      </header>

      <ul v-if="bindings.posts.length > 0" class="profile-org-bindings-card__list">
        <li v-for="post in bindings.posts" :key="post.id" class="profile-org-bindings-card__item">
          <div class="profile-org-bindings-card__item-main">
            <span class="profile-org-bindings-card__name">{{ post.postName }}</span>
            <el-tag v-if="post.isPrimary" effect="light" size="small" type="primary">
              {{ t('account.orgBindings.primaryMark') }}
            </el-tag>
          </div>

          <p class="profile-org-bindings-card__meta">{{ post.postCode }} · {{ statusLabel(post.status) }}</p>
        </li>
      </ul>
      <el-text v-else type="info">{{ t('account.orgBindings.emptyPosts') }}</el-text>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.profile-org-bindings-card {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (width <= 768px) {
    grid-template-columns: 1fr;
  }

  &__column {
    min-width: 0;
    padding: 16px;
    background: var(--el-fill-color-blank);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 8px;
  }

  &__header {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 12px;
  }

  &__title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.4;
    color: var(--el-text-color-primary);
  }

  &__count {
    font-size: 13px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: var(--el-text-color-secondary);
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  &__item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
  }

  &__item-main {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    min-width: 0;
  }

  &__name {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    color: var(--el-text-color-primary);
  }

  &__meta {
    margin: 0;
    font-size: 12px;
    line-height: 1.4;
    color: var(--el-text-color-secondary);
  }
}
</style>
