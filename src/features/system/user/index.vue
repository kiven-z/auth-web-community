<script lang="ts" setup>
import { DEFAULT_ADAPTIVE_OFFSET_BOTTOM, useAdaptiveFillHeight } from '@/components/table/DataTable';
import UserDeptTreePanel from '@/features/system/user/list/components/UserDeptTreePanel.vue';
import UserTablePanel from '@/features/system/user/list/components/UserTablePanel.vue';
import { ref } from 'vue';

defineOptions({
  name: 'SystemUser',
});

/** 页面定高：左右栏共用同一高度源，避免树用魔法常量、表用 viewport 各算各的 */
const pageRef = ref<HTMLElement | null>(null);

useAdaptiveFillHeight(pageRef, {
  offsetBottom: () => DEFAULT_ADAPTIVE_OFFSET_BOTTOM,
});
</script>

<template>
  <div ref="pageRef" class="user-page">
    <aside class="user-page__aside">
      <UserDeptTreePanel />
    </aside>
    <main class="user-page__main">
      <UserTablePanel />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.user-page {
  display: flex;
  gap: 8px;
  min-height: 0;
  overflow: hidden;

  &__aside {
    display: flex;
    flex-direction: column;
    width: 17rem;
    height: 100%;
    min-height: 0;
    overflow: hidden;
  }

  &__main {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    height: 100%;
    min-height: 0;
    overflow: hidden;
  }
}
</style>
