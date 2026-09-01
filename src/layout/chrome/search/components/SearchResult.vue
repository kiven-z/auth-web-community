<script lang="ts" setup>
import { transformI18n } from '@/app/plugins/i18n';
import { useRenderIcon } from '@/components/ui/icon';
import { useResizeObserver } from '@vueuse/core';
import { computed, getCurrentInstance, onMounted, ref } from 'vue';
import EnterOutlined from '~icons/ri/corner-down-left-line';
import type { SearchListProps } from '../types';

interface Emits {
  'update:value': [val: string];
  enter: [];
}

const resultRef = ref();
const innerHeight = ref();
const emit = defineEmits<Emits>();
const instance = getCurrentInstance()!;
const props = withDefaults(defineProps<SearchListProps>(), {});

const active = computed({
  get() {
    return props.value;
  },
  set(val: string) {
    emit('update:value', val);
  },
});

/** 鼠标移入 */
async function handleMouse(item) {
  active.value = item.path;
}

function handleTo() {
  emit('enter');
}

function resizeResult() {
  // el-scrollbar max-height="calc(90vh - 140px)"
  innerHeight.value = window.innerHeight - window.innerHeight / 10 - 140;
}

useResizeObserver(resultRef, resizeResult);

function handleScroll(index: number) {
  const curInstance = instance?.proxy?.$refs[`resultItemRef${index}`];
  if (!curInstance) return 0;
  const curRef = curInstance[0] as ElRef;
  const scrollTop = curRef.offsetTop + 128; // 128 两个result-item（56px+56px=112px）高度加上下margin（8px+8px=16px）
  return scrollTop > innerHeight.value ? scrollTop - innerHeight.value : 0;
}

onMounted(() => {
  resizeResult();
});

defineExpose({ handleScroll });
</script>

<template>
  <div ref="resultRef" class="search-result">
    <div
      v-for="(item, index) in options"
      :key="item.path"
      :ref="'resultItemRef' + index"
      :class="['search-result__item', { 'search-result__item--active': item.path === active }]"
      @click="handleTo"
      @mouseenter="handleMouse(item)"
    >
      <component :is="useRenderIcon(item.meta?.icon)" />
      <span class="search-result__title">
        {{ transformI18n(item.meta?.title) }}
      </span>
      <IconifyIconOffline :icon="EnterOutlined" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-result {
  padding-bottom: 12px;
}

.search-result__item {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 14px;
  margin-top: 8px;
  font-size: 14px;
  cursor: pointer;
  background: var(--auth-bg-component);
  border: 0.1px solid var(--auth-color-border);
  border-radius: 4px;
  transition: font-size 0.16s;
}

.search-result__item--active {
  font-size: 16px;
  color: var(--auth-text-anti);
  background: var(--el-color-primary);
}

.search-result__title {
  display: flex;
  flex: 1;
  margin-left: 5px;
}
</style>
