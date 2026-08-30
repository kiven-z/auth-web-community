<script lang="ts" setup>
import { APP_TITLE } from '@/core/config/appConfig';

defineOptions({
  name: 'LayoutFooter',
});
</script>

<template>
  <footer class="layout-footer">
    Copyright © 2020-present
    <span class="layout-footer__brand">&nbsp;{{ APP_TITLE }}</span>
  </footer>
</template>

<style lang="scss" scoped>
.layout-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0 0 8px;
  font-size: 14px;
  color: var(--auth-text-secondary);
}

.layout-footer__brand {
  &:hover {
    color: var(--el-color-primary);
  }
}
</style>
