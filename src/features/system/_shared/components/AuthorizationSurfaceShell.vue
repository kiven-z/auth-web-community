<script lang="ts" setup>
import type { DetailRelationCountItem } from '@/features/system/_shared/types';
import DetailRelationCountBar from '@/features/system/_shared/components/DetailRelationCountBar.vue';

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
</script>

<template>
  <div class="authorization-surface-shell">
    <div v-loading="loading" class="authorization-surface-shell__summary">
      <DetailRelationCountBar
        :items="items"
        :show-view-authorization="false"
        class="authorization-surface-shell__counts"
      />
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
    margin-bottom: 12px;
  }

  &__counts {
    flex: 1;
    min-width: 0;
  }

  &__actions {
    flex-shrink: 0;
  }

  &__body {
    margin-top: 12px;
  }
}
</style>
