<script lang="ts" setup>
import { computed, provide, ref, toRef, useAttrs } from 'vue';
import { useI18n } from 'vue-i18n';
import type { TreeInstance } from 'element-plus';

import ExitFullscreen from '~icons/ri/fullscreen-exit-fill';
import Fullscreen from '~icons/ri/fullscreen-fill';
import RefreshIcon from '~icons/ri/refresh-line';

import { useElTreeExpandCollapse } from './hooks/use-el-tree-expand-collapse';
import { type TreeRowActionsLockContext, treeRowActionsLockKey } from './tree-row-actions-lock';

import './index.scss';

defineOptions({
  name: 'ElTreePanel',
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    title?: string;
    loading?: boolean;
    treeData?: unknown[];
    treeProps?: Record<string, string>;
    nodeKey?: string;
    expandAllLabel: string;
    collapseAllLabel: string;
    /** 树容器额外 class，默认固定高度，便于和表格侧同屏对照 */
    contentClass?: string;
    /** 仅在 hover 行时挂载操作区，减轻大树首屏渲染压力 */
    showActionsOnHover?: boolean;
  }>(),
  {
    title: '',
    loading: false,
    treeData: () => [],
    treeProps: () => ({ label: 'label', children: 'children' }),
    nodeKey: 'id',
    contentClass: 'h-[70vh]',
    showActionsOnHover: false,
  }
);

const emit = defineEmits<{
  refresh: [];
}>();

const { t } = useI18n();
const treeRef = ref<TreeInstance>();
const treeDataRef = toRef(props, 'treeData');
const attrs = useAttrs();
const hoveredNodeKey = ref<string | null>(null);
const lockedNodeKey = ref<string | null>(null);
const isFullscreen = ref(false);

const treeRowActionsLock: TreeRowActionsLockContext = {
  lock(nodeKey: string) {
    lockedNodeKey.value = nodeKey;
  },
  unlock(nodeKey: string) {
    if (lockedNodeKey.value === nodeKey) {
      lockedNodeKey.value = null;
    }
  },
};

provide(treeRowActionsLockKey, treeRowActionsLock);

const { expandedKeys, expandAll, collapseAll } = useElTreeExpandCollapse({
  treeRef,
  treeData: treeDataRef,
  nodeIdKey: props.nodeKey,
});

const fullscreenIcon = computed(() => (isFullscreen.value ? ExitFullscreen : Fullscreen));
const panelTitle = computed(() => props.title || t('listTable.defaultTitle'));

/**
 * 解析树节点主键
 * @param data 节点数据
 * @returns 节点主键字符串
 */
function resolveNodeKey(data: Record<string, unknown>): string {
  const key = data[props.nodeKey];
  return key == null ? '' : String(key);
}

/**
 * 当前行是否挂载操作区
 * @param data 节点数据
 * @returns 是否展示
 */
function isActionsVisible(data: Record<string, unknown>): boolean {
  if (!props.showActionsOnHover) {
    return true;
  }
  const key = resolveNodeKey(data);
  if (!key) {
    return false;
  }
  return hoveredNodeKey.value === key || lockedNodeKey.value === key;
}

/**
 * 鼠标移入树行
 * @param data 节点数据
 */
function handleRowEnter(data: Record<string, unknown>) {
  if (!props.showActionsOnHover) {
    return;
  }
  hoveredNodeKey.value = resolveNodeKey(data);
}

/**
 * 鼠标移出树行
 */
function handleRowLeave() {
  if (!props.showActionsOnHover) {
    return;
  }
  hoveredNodeKey.value = null;
}

function handleRefresh() {
  emit('refresh');
}

function handleFullscreen() {
  isFullscreen.value = !isFullscreen.value;
}

defineExpose({
  filterTree(keyword: string) {
    treeRef.value?.filter(keyword);
  },
});
</script>

<template>
  <div :class="{ 'el-tree-panel--fullscreen': isFullscreen }" class="el-tree-panel bg-auth-container">
    <div class="el-tree-panel__toolbar">
      <p class="m-0 truncate text-base font-bold">{{ panelTitle }}</p>

      <div class="el-tree-panel__actions">
        <div class="mr-4 flex">
          <slot name="toolbar" />
          <el-button-group class="ml-3" type="primary">
            <el-button type="info" @click="expandAll">{{ expandAllLabel }}</el-button>
            <el-button type="info" @click="collapseAll">{{ collapseAllLabel }}</el-button>
          </el-button-group>
        </div>

        <RefreshIcon
          :class="['w-4', 'cursor-pointer', 'outline-hidden', 'hover:text-primary!', loading ? 'animate-spin' : '']"
          :title="t('listTable.refresh')"
          @click="handleRefresh"
        />
        <el-divider direction="vertical" />
        <component
          :is="fullscreenIcon"
          :class="['w-4', 'cursor-pointer', 'outline-hidden', 'hover:text-primary!']"
          :title="t(isFullscreen ? 'listTable.tippyExitFullscreen' : 'listTable.tippyFullscreen')"
          @click="handleFullscreen"
        />
      </div>
    </div>

    <div class="el-tree-panel__body">
      <div v-if="$slots.search" class="px-2 pb-2">
        <slot name="search" />
      </div>
      <div v-loading="loading" :class="contentClass" class="min-h-50 overflow-auto px-2">
        <el-tree
          ref="treeRef"
          :data="treeData"
          :default-expanded-keys="expandedKeys"
          :expand-on-click-node="false"
          :node-key="nodeKey"
          :props="treeProps"
          default-expand-all
          highlight-current
          v-bind="attrs"
        >
          <template #default="{ data }">
            <div
              class="flex w-full min-w-0 flex-wrap items-center gap-2 py-1"
              @mouseenter="handleRowEnter(data)"
              @mouseleave="handleRowLeave"
            >
              <div class="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                <slot :data="data" name="meta" />
              </div>
              <div class="ml-auto flex min-h-7 shrink-0 flex-wrap items-center gap-x-1" @click.stop>
                <div v-if="isActionsVisible(data)" class="flex flex-wrap items-center gap-x-1">
                  <slot :data="data" name="actions" />
                </div>
              </div>
            </div>
          </template>
        </el-tree>
      </div>
    </div>
  </div>
</template>
