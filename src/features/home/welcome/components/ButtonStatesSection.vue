<script lang="ts" setup>
import ThemeLabSection from './ThemeLabSection.vue';

defineOptions({
  name: 'ButtonStatesSection',
});

const buttonTypes = ['primary', 'success', 'warning', 'danger', 'info'] as const;
</script>

<template>
  <ThemeLabSection hint="验 hover / disabled；吃 primary-light-* 与 dark-2" title="按钮态">
    <div v-for="type in buttonTypes" :key="type" class="button-states-section__row">
      <span class="button-states-section__label">{{ type }}</span>
      <div class="button-states-section__actions">
        <el-button :type="type">Default</el-button>
        <el-button :type="type" plain>Plain</el-button>
        <el-button :type="type" text>Text</el-button>
        <el-button :type="type" link>Link</el-button>
        <el-button :type="type" disabled>Disabled</el-button>
        <el-button :type="type" disabled plain>Plain Disabled</el-button>
      </div>
    </div>
  </ThemeLabSection>
</template>

<style lang="scss" scoped>
.button-states-section {
  &__row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 12px;
    align-items: center;
  }

  &__label {
    flex: 0 0 64px;
    font-size: var(--auth-font-size-small);
    color: var(--auth-text-secondary);
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }
}
</style>
