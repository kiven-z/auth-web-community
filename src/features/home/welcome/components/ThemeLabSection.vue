<script lang="ts" setup>
defineOptions({
  name: 'ThemeLabSection',
});

defineProps<{
  title: string;
  hint?: string;
}>();
</script>

<template>
  <section class="theme-lab-section">
    <header class="theme-lab-section__header">
      <h2 class="theme-lab-section__title">{{ title }}</h2>
      <p v-if="hint" class="theme-lab-section__hint">{{ hint }}</p>
    </header>
    <div class="theme-lab-section__body">
      <slot />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.theme-lab-section {
  padding: 16px;
  background: var(--auth-bg-container);
  border: 1px solid var(--auth-color-border);
  border-radius: var(--auth-radius-default);

  &__header {
    margin-bottom: 12px;
  }

  &__title {
    margin: 0;
    font-size: var(--auth-font-size-large);
    font-weight: 600;
    color: var(--auth-text-primary);
  }

  &__hint {
    margin: 4px 0 0;
    font-size: var(--auth-font-size-small);
    color: var(--auth-text-placeholder);
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}
</style>
