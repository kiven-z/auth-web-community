<script lang="ts" setup>
import type { DetailRelationCountItem } from '@/features/system/_shared/types';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'AuthorizationSurfaceShell' });

/** 授权面外壳：摘要计数 + 可选操作区 + 主内容 */
interface AuthorizationSurfaceShellProps {
  /** 摘要计数项 */
  items: DetailRelationCountItem[];
  /** 摘要区加载中 */
  loading?: boolean;
}

withDefaults(defineProps<AuthorizationSurfaceShellProps>(), {
  loading: false,
});

const { t } = useI18n();
</script>

<template>
  <div class="authorization-surface-shell">
    <div v-loading="loading" class="authorization-surface-shell__summary">
      <div class="authorization-surface-shell__counts">
        <span class="authorization-surface-shell__title">{{ t('authorization.relationTitle') }}</span>
        <ul class="authorization-surface-shell__items">
          <li v-for="item in items" :key="item.label" class="flex gap-1">
            <el-text>{{ item.label }}</el-text>
            <el-text tag="b" type="primary">{{ item.count ?? 0 }}</el-text>
          </li>
        </ul>
      </div>

      <div v-if="$slots.actions" class="authorization-surface-shell__actions">
        <slot name="actions" />
      </div>
    </div>

    <div class="authorization-surface-shell__body">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.authorization-surface-shell {
  &__summary {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    justify-content: space-between;
  }

  &__counts {
    flex: 1;
    min-width: 0;
  }

  &__title {
    display: block;
    font-size: 14px;
    font-weight: 600;
  }

  &__items {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  &__actions {
    flex-shrink: 0;
  }

  &__body {
    margin-top: 12px;
  }
}
</style>
