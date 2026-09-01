<script lang="ts" setup>
defineOptions({
  name: 'ActionRow',
});
</script>

<template>
  <section class="action-row">
    <div class="action-row__main">
      <el-text class="action-row__title" tag="b">
        <slot name="title" />
      </el-text>
      <el-text class="action-row__desc" type="info">
        <slot name="description" />
      </el-text>
    </div>
    <div class="action-row__actions">
      <slot name="actions" />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;

  &__main {
    min-width: 0;
  }

  &__title {
    display: block;
    font-size: 16px;
  }

  &__desc {
    display: block;
    margin-top: 4px;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
  }
}
</style>
