<script lang="ts" setup>
defineOptions({ name: 'AuthorizationSurfaceShell' });
</script>

<template>
  <div class="authorization-surface-shell">
    <div v-if="$slots.actions" class="authorization-surface-shell__actions">
      <slot name="actions" />
    </div>

    <div class="authorization-surface-shell__body">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.authorization-surface-shell {
  &__actions {
    display: flex;
    flex-shrink: 0;
    gap: 8px;
    justify-content: flex-end;
    margin-bottom: 12px;
  }
}
</style>
