<script lang="ts" setup>
import { ref } from 'vue';
import SearchModal from './components/SearchModal.vue';

defineOptions({
  name: 'MenuSearch',
});

const show = ref(false);

/** 打开 / 关闭菜单搜索 */
function handleSearch(): void {
  show.value = !show.value;
}
</script>

<template>
  <div>
    <div class="layout-toolbar__search layout-toolbar__hover" @click="handleSearch">
      <IconifyIconOffline icon="ri/search-line" />
    </div>
    <SearchModal v-model:value="show" />
  </div>
</template>

<style lang="scss" scoped>
.layout-toolbar__search {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 48px;
  cursor: pointer;
}
</style>
