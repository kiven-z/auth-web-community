<script lang="ts" setup>
import { ref } from 'vue';
import SearchIcon from '~icons/ri/search-line';
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
    <div class="layout-toolbar__item" @click="handleSearch">
      <SearchIcon />
    </div>
    <SearchModal v-model:value="show" />
  </div>
</template>
