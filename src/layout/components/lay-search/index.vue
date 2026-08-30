<script lang="ts" setup>
import { ref } from 'vue';
import SearchModal from './components/SearchModal.vue';

defineOptions({
  name: 'LaySearch',
});

const show = ref(false);

/** 打开 / 关闭菜单搜索 */
function handleSearch(): void {
  show.value = !show.value;
}
</script>

<template>
  <div>
    <div class="layout-toolbar__search w-10 h-12 flex-c cursor-pointer navbar-bg-hover" @click="handleSearch">
      <IconifyIconOffline icon="ri/search-line" />
    </div>
    <SearchModal v-model:value="show" />
  </div>
</template>
