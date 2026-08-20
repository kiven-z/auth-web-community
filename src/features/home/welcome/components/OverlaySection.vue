<script lang="ts" setup>
import { ref } from 'vue';
import ThemeLabSection from './ThemeLabSection.vue';

defineOptions({
  name: 'OverlaySection',
});

const dialogVisible = ref(false);
const drawerVisible = ref(false);
</script>

<template>
  <ThemeLabSection hint="Dialog / Drawer / Popover 验 overlay 与容器底；暗色勿发灰白罩" title="浮层 Overlay">
    <div class="overlay-section__actions">
      <el-button type="primary" @click="dialogVisible = true">打开 Dialog</el-button>
      <el-button @click="drawerVisible = true">打开 Drawer</el-button>
      <el-popover :width="220" placement="top" trigger="click">
        <template #reference>
          <el-button>打开 Popover</el-button>
        </template>
        <p class="overlay-section__popover-text">Popover 内容：背景应走 bg-container</p>
      </el-popover>
    </div>

    <el-dialog v-model="dialogVisible" title="色阶冒烟 Dialog" width="420px">
      <p>遮罩与面板底色应跟 token，换主色不影响 overlay 压暗语义。</p>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="dialogVisible = false">确认</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="drawerVisible" size="360px" title="色阶冒烟 Drawer">
      <p>侧栏抽屉容器底与文字对比度。</p>
    </el-drawer>
  </ThemeLabSection>
</template>

<style lang="scss" scoped>
.overlay-section {
  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__popover-text {
    margin: 0;
    color: var(--auth-text-secondary);
  }
}
</style>
