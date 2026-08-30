<script lang="ts" setup>
import Sortable from 'sortablejs';
import { useI18n } from 'vue-i18n';
import type { MenuSearchDrag, MenuSearchOption, SearchHistoryProps } from '../types';
import { transformI18n } from '@/app/plugins/i18n';
import { useRenderIcon } from '@/components/ui/Icon';
import { delay } from '@/shared/utils/async/delay';
import isArray from 'lodash/isArray';
import { useResizeObserver } from '@vueuse/core';
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import StarIcon from '~icons/ep/star';
import CloseIcon from '~icons/ep/close';

interface Emits {
  'update:value': [val: string];
  enter: [];
  collect: [val: MenuSearchOption];
  delete: [val: MenuSearchOption];
  drag: [val: MenuSearchDrag];
}

const historyRef = ref();
const collectRef = ref<HTMLElement>();
const innerHeight = ref();
/** 判断是否停止鼠标移入事件处理 */
const stopMouseEvent = ref(false);

const { t } = useI18n();
const emit = defineEmits<Emits>();
const instance = getCurrentInstance()!;
const props = withDefaults(defineProps<SearchHistoryProps>(), {});

const itemStyle = computed(() => {
  return (item) => {
    return {
      background: item?.path === active.value ? 'var(--el-color-primary)' : '',
      color: item.path === active.value ? 'var(--auth-text-anti)' : '',
      fontSize: item.path === active.value ? '16px' : '14px',
    };
  };
});

const titleStyle = {
  color: 'var(--el-color-primary)',
  fontWeight: 500,
};

const active = computed({
  get() {
    return props.value;
  },
  set(val: string) {
    emit('update:value', val);
  },
});

watch(
  () => props.value,
  (newValue) => {
    if (newValue) {
      if (stopMouseEvent.value) {
        delay(100).then(() => (stopMouseEvent.value = false));
      }
    }
  }
);

const historyList = computed(() => {
  return props.options.filter((item) => item.type === 'history');
});

const collectList = computed(() => {
  return props.options.filter((item) => item.type === 'collect');
});

function handleCollect(item) {
  emit('collect', item);
}

function handleDelete(item) {
  stopMouseEvent.value = true;
  emit('delete', item);
}

/** 鼠标移入 */
async function handleMouse(item) {
  if (!stopMouseEvent.value) active.value = item.path;
}

function handleTo() {
  emit('enter');
}

function resizeResult() {
  // el-scrollbar max-height="calc(90vh - 140px)"
  innerHeight.value = window.innerHeight - window.innerHeight / 10 - 140;
}

useResizeObserver(historyRef, resizeResult);

function handleScroll(index: number) {
  const curInstance = instance?.proxy?.$refs[`historyItemRef${index}`];
  if (!curInstance) return 0;
  const curRef = isArray(curInstance) ? (curInstance[0] as ElRef) : (curInstance as ElRef);
  const scrollTop = curRef.offsetTop + 128; // 128：两个 search-history__item 高度 + margin
  return scrollTop > innerHeight.value ? scrollTop - innerHeight.value : 0;
}

const handleChangeIndex = (evt): void => {
  emit('drag', { oldIndex: evt.oldIndex, newIndex: evt.newIndex });
};

let sortableInstance: ReturnType<typeof Sortable.create> | null = null;

function destroyCollectSortable() {
  sortableInstance?.destroy();
  sortableInstance = null;
}

watch(
  collectList,
  (val) => {
    if (val.length <= 1) {
      destroyCollectSortable();
      return;
    }

    nextTick(() => {
      const wrapper = collectRef.value;
      if (!wrapper || sortableInstance) {
        return;
      }

      sortableInstance = Sortable.create(wrapper, {
        animation: 160,
        onStart: (event) => {
          event.item.style.cursor = 'move';
        },
        onEnd: (event) => {
          event.item.style.cursor = 'pointer';
        },
        onUpdate: handleChangeIndex,
      });
      resizeResult();
    });
  },
  { deep: true, immediate: true }
);

onBeforeUnmount(destroyCollectSortable);

defineExpose({ handleScroll });
</script>

<template>
  <div ref="historyRef" class="search-history">
    <template v-if="historyList.length">
      <div :style="titleStyle">
        {{ t('search.history') }}
      </div>
      <div
        v-for="(item, index) in historyList"
        :key="item.path"
        :ref="'historyItemRef' + index"
        :style="itemStyle(item)"
        class="search-history__item dark:bg-auth-component"
        @click="handleTo"
        @mouseenter="handleMouse(item)"
      >
        <component :is="useRenderIcon(item.meta?.icon)" />
        <span class="search-history__title">
          {{ transformI18n(item.meta?.title) }}
        </span>
        <IconifyIconOffline
          v-show="item.type === 'history'"
          :icon="StarIcon"
          class="w-[18px] h-[18px] mr-2 hover:text-auth-text-secondary"
          @click.stop="handleCollect(item)"
        />
        <IconifyIconOffline
          :icon="CloseIcon"
          class="w-[18px] h-[18px] hover:text-auth-text-secondary cursor-pointer"
          @click.stop="handleDelete(item)"
        />
      </div>
    </template>
    <template v-if="collectList.length">
      <div :style="titleStyle">
        {{ `${t('search.collect')}${collectList.length > 1 ? t('search.dragSort') : ''}` }}
      </div>
      <div ref="collectRef" class="search-history__collect">
        <div
          v-for="(item, index) in collectList"
          :key="item.path"
          :ref="'historyItemRef' + (index + historyList.length)"
          :style="itemStyle(item)"
          class="search-history__item dark:bg-auth-component"
          @click="handleTo"
          @mouseenter="handleMouse(item)"
        >
          <component :is="useRenderIcon(item.meta?.icon)" />
          <span class="search-history__title">
            {{ transformI18n(item.meta?.title) }}
          </span>
          <IconifyIconOffline
            :icon="CloseIcon"
            class="w-[18px] h-[18px] hover:text-auth-text-secondary cursor-pointer"
            @click.stop="handleDelete(item)"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.search-history {
  padding-bottom: 12px;

  &__item {
    display: flex;
    align-items: center;
    height: 56px;
    padding: 14px;
    margin: 8px auto 10px;
    cursor: pointer;
    border: 0.1px solid var(--auth-color-border);
    border-radius: 4px;
    transition: font-size 0.16s;
  }
}

.search-history__title {
  display: flex;
  flex: 1;
  margin-left: 5px;
}
</style>
