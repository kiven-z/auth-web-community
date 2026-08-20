<script lang="ts" setup>
import { ref } from 'vue';
import ThemeLabSection from './ThemeLabSection.vue';

defineOptions({
  name: 'LoadingMaskSection',
});

const loading = ref(true);
</script>

<template>
  <ThemeLabSection hint="v-loading 吃 primary-light-9 / mask token；开关后看罩层色" title="Loading Mask">
    <div class="loading-mask-section__actions">
      <el-switch v-model="loading" active-text="loading" />
    </div>
    <div v-loading="loading" class="loading-mask-section__panel">罩层下方内容区（换主色后 mask 应跟 brand-1）</div>
  </ThemeLabSection>
</template>

<style lang="scss" scoped>
.loading-mask-section {
  &__actions {
    display: flex;
    align-items: center;
  }

  &__panel {
    min-height: 120px;
    padding: 16px;
    color: var(--auth-text-secondary);
    border: 1px dashed var(--auth-color-border);
    border-radius: var(--auth-radius-default);
  }
}
</style>
