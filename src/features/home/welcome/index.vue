<script lang="ts" setup>
import { defineAsyncComponent, ref } from 'vue';

defineOptions({
  name: 'AuthWelcome',
});

type WelcomeDevTab = 'theme' | 'data-scope';

const ThemeLabTab = defineAsyncComponent(() => import('./tabs/ThemeLabTab.vue'));
const DataScopeTab = defineAsyncComponent(() => import('./tabs/DataScopeTab.vue'));

const activeTab = ref<WelcomeDevTab>('theme');
</script>

<template>
  <div class="welcome-dev bg-auth-container">
    <header class="welcome-dev__header">
      <h1 class="welcome-dev__title">开发期烟囱页</h1>
      <p class="welcome-dev__desc">色阶与数据权限演示；验收后可整包删除 welcome/tabs 与 welcome/api。</p>
    </header>

    <el-tabs v-model="activeTab" class="welcome-dev__tabs">
      <el-tab-pane label="色阶冒烟" lazy name="theme">
        <ThemeLabTab />
      </el-tab-pane>
      <el-tab-pane label="数据权限订单" lazy name="data-scope">
        <DataScopeTab />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.welcome-dev {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  overflow: auto;

  &__header {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__title {
    margin: 0;
    font-size: var(--auth-font-size-headline);
    font-weight: 600;
    color: var(--auth-text-primary);
  }

  &__desc {
    margin: 0;
    font-size: var(--auth-font-size-small);
    color: var(--auth-text-placeholder);
  }

  &__tabs {
    :deep(.el-tabs__content) {
      padding-top: 16px;
    }
  }
}
</style>
