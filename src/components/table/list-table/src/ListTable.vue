<script lang="ts" setup>
import DataTable, { type DataTableAdaptiveConfig, type DataTableAdaptiveMode } from '@/components/table/data-table';
import { computed, nextTick, ref, shallowRef, toRef, useAttrs, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import ExpandIcon from '~icons/ri/expand-up-down-line';
import ExitFullscreen from '~icons/ri/fullscreen-exit-fill';
import Fullscreen from '~icons/ri/fullscreen-fill';
import RefreshIcon from '~icons/ri/refresh-line';

import './index.scss';
import { LIST_TABLE_HEADER_CELL_STYLE, LIST_TABLE_ICON_CLASS, type ListTableDensity } from './constants';
import { useListTableColumns } from './hooks/use-list-table-columns';
import { useTreeExpandAll } from './hooks/use-tree-expand-all';
import ColumnSettingPopover from './render/ColumnSettingPopover.vue';
import DensityDropdown from './render/DensityDropdown.vue';
import type { ListTableExpose, ListTableState, TableTreeControlRef } from './types';
import { tippyOptions } from './utils/tippy-options';

defineOptions({
  name: 'ListTable',
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    state: ListTableState;
    columns: TableColumnList;
    title?: string;
    rowKey?: string | ((row: unknown) => string);
    /** 高度模式：默认 viewport（全页对窗口量）；已定高父级用 fill */
    adaptive?: DataTableAdaptiveMode;
    adaptiveConfig?: DataTableAdaptiveConfig;
    border?: boolean;
    highlightCurrentRow?: boolean;
    alignWhole?: 'left' | 'center' | 'right';
    tableLayout?: 'fixed' | 'auto';
    showOverflowTooltip?: boolean;
    /** 树形表格 tree-props；传入后工具条显示展开/折叠 */
    treeProps?: Record<string, string>;
    /** 树形表格默认展开全部 */
    defaultExpandAll?: boolean;
  }>(),
  {
    title: '',
    rowKey: 'id',
    adaptive: 'viewport',
    border: true,
    highlightCurrentRow: true,
    alignWhole: 'center',
    tableLayout: 'fixed',
    showOverflowTooltip: true,
    defaultExpandAll: false,
  }
);

const emit = defineEmits<{
  'selection-change': [rows: unknown[]];
}>();

const attrs = useAttrs();
const { t } = useI18n();

const tableRef = ref<{
  setAdaptive: () => Promise<void>;
  getTableRef: () => TableTreeControlRef | null;
  clearSelection: () => void;
} | null>(null);

/** 树表展开/折叠所需的 el-table 实例（挂载后同步） */
const treeTableControl = shallowRef<TableTreeControlRef | undefined>(undefined);
const isFullscreen = ref(false);
const size = ref<ListTableDensity>('default');
const columnsRef = toRef(props, 'columns');

const {
  checkAll,
  isIndeterminate,
  checkColumnList,
  checkedColumns,
  dynamicColumns,
  handleCheckAllChange,
  handleCheckedColumnsChange,
  handleCheckColumnListChange,
  resetColumns,
  initSortable,
  destroySortable,
  isFixedColumn,
} = useListTableColumns(columnsRef);

const { isExpandAll, onExpand } = useTreeExpandAll(treeTableControl, props.defaultExpandAll);

const tableData = computed(() => props.state.tableData.value);
const loading = computed(() => props.state.loading.value);
const isFillMode = computed(() => props.adaptive === 'fill');
const pagination = computed(() => props.state.pagination ?? null);
const isTreeTable = computed(() => !!props.treeProps);
const showTreeExpand = computed(() => isTreeTable.value && !!treeTableControl.value?.size);
const fullscreenIcon = computed(() => (isFullscreen.value ? ExitFullscreen : Fullscreen));

/** 透传 attrs，并叠树表专有属性 */
const dataTableAttrs = computed(() => {
  const next: Record<string, unknown> = { ...attrs };
  if (props.treeProps) {
    next.treeProps = props.treeProps;
  }
  if (props.defaultExpandAll) {
    next.defaultExpandAll = true;
  }
  return next;
});

/**
 * 同步树表实例（须在 DataTable 挂载后读取）。
 */
async function syncTreeTableControl() {
  if (!isTreeTable.value) {
    treeTableControl.value = undefined;
    return;
  }
  await nextTick();
  treeTableControl.value = tableRef.value?.getTableRef() ?? undefined;
}

watch(
  [isTreeTable, tableData, tableRef],
  () => {
    void syncTreeTableControl();
  },
  { immediate: true }
);

/**
 * 工具栏刷新：委托给列表状态重新拉取。
 */
async function handleRefresh() {
  await props.state.fetchTableData();
}

/**
 * 全屏切换后重算表格高度。
 */
async function handleFullscreen() {
  isFullscreen.value = !isFullscreen.value;
  await tableRef.value?.setAdaptive();
}

/**
 * 多选变化：同步 selectedRows，并向外透传。
 * @param rows 当前选中行
 */
function handleSelectionChange(rows: unknown[]) {
  props.state.handleSelectionChange(rows);
  emit('selection-change', rows);
}

/**
 * 清空 el-table 多选 UI。
 */
function clearSelection() {
  tableRef.value?.clearSelection();
}

/** 业务层 selectedRows 清空时同步清除表格勾选，避免 UI 与 hasSelection 不一致 */
watch(
  () => props.state.selectedRows.value,
  (rows) => {
    if (rows.length === 0) {
      clearSelection();
    }
  }
);

/**
 * 分页大小变化（无分页 state 时不绑定）。
 */
async function handlePageSizeChange(pageSize: number) {
  await props.state.handlePageSizeChange?.(pageSize);
}

/**
 * 当前页变化（无分页 state 时不绑定）。
 */
async function handlePageCurrentChange(page: number) {
  await props.state.handlePageCurrentChange?.(page);
}

defineExpose<ListTableExpose>({
  setAdaptive: () => tableRef.value?.setAdaptive() ?? Promise.resolve(),
  fetchTableData: () => props.state.fetchTableData(),
  clearSelection,
});
</script>

<template>
  <div
    :class="{
      'list-table--fullscreen': isFullscreen,
      'list-table--fill': isFillMode,
    }"
    class="list-table bg-auth-container"
  >
    <div class="list-table__toolbar">
      <slot name="title">
        <p class="m-0 truncate text-base font-bold">
          {{ title || t('listTable.defaultTitle') }}
        </p>
      </slot>

      <div class="list-table__actions">
        <div v-if="$slots.buttons" class="list-table__buttons mr-4">
          <slot name="buttons" />
        </div>

        <template v-if="showTreeExpand">
          <IconifyIconOffline
            v-tippy="tippyOptions(t, isExpandAll ? 'listTable.tippyCollapse' : 'listTable.tippyExpand')"
            :class="['w-4', LIST_TABLE_ICON_CLASS]"
            :icon="ExpandIcon"
            :style="{ transform: isExpandAll ? 'none' : 'rotate(90deg)' }"
            @click="onExpand"
          />
          <el-divider direction="vertical" />
        </template>

        <IconifyIconOffline
          v-tippy="tippyOptions(t, 'listTable.refresh')"
          :class="['w-4', LIST_TABLE_ICON_CLASS, loading ? 'animate-spin' : '']"
          :icon="RefreshIcon"
          @click="handleRefresh"
        />
        <el-divider direction="vertical" />

        <DensityDropdown v-model:size="size" />
        <el-divider direction="vertical" />

        <ColumnSettingPopover
          v-model:check-all="checkAll"
          :check-all-change="handleCheckAllChange"
          :check-column-list="checkColumnList"
          :check-column-list-change="handleCheckColumnListChange"
          :checked-columns="checkedColumns"
          :checked-columns-change="handleCheckedColumnsChange"
          :destroy-sortable="destroySortable"
          :init-sortable="initSortable"
          :is-fixed-column="isFixedColumn"
          :is-indeterminate="isIndeterminate"
          :reset="resetColumns"
        />
        <el-divider direction="vertical" />

        <IconifyIconOffline
          v-tippy="tippyOptions(t, isFullscreen ? 'listTable.tippyExitFullscreen' : 'listTable.tippyFullscreen')"
          :class="['w-4', LIST_TABLE_ICON_CLASS]"
          :icon="fullscreenIcon"
          @click="handleFullscreen"
        />
      </div>
    </div>

    <div class="list-table__body">
      <DataTable
        ref="tableRef"
        :adaptive="adaptive"
        :adaptive-config="adaptiveConfig"
        :align-whole="alignWhole"
        :border="border"
        :columns="dynamicColumns"
        :data="tableData"
        :header-cell-style="LIST_TABLE_HEADER_CELL_STYLE"
        :highlight-current-row="highlightCurrentRow"
        :loading="loading"
        :pagination="pagination"
        :row-key="rowKey"
        :show-overflow-tooltip="showOverflowTooltip"
        :size="size"
        :table-layout="tableLayout"
        v-bind="dataTableAttrs"
        @page-current-change="handlePageCurrentChange"
        @page-size-change="handlePageSizeChange"
        @selection-change="handleSelectionChange"
      >
        <template v-if="$slots.actions" #actions="slotProps">
          <div class="flex items-center justify-center">
            <slot name="actions" v-bind="slotProps" />
          </div>
        </template>

        <template v-if="$slots.append" #append>
          <slot name="append" />
        </template>

        <template v-if="$slots.empty" #empty>
          <slot name="empty" />
        </template>
      </DataTable>
    </div>
  </div>
</template>
