<script lang="ts" setup>
import type { ElTable } from 'element-plus';
import { computed, provide, ref, useAttrs, useSlots, watch } from 'vue';

import DataTableColumn from './DataTableColumn.vue';
import {
  DEFAULT_ADAPTIVE_DEBOUNCE_MS,
  DEFAULT_ADAPTIVE_OFFSET_BOTTOM,
  DEFAULT_PAGE_SIZES,
  DEFAULT_PAGINATION_LAYOUT,
  MIN_ADAPTIVE_TABLE_HEIGHT_PX,
} from './constants';
import { DATA_TABLE_SLOTS_KEY } from './context';
import { useTableHeight } from './hooks/use-table-height';
import { columnVisible } from './render/resolve-cell';
import type { DataTableAdaptiveConfig, DataTableAdaptiveMode, DataTablePagination } from './types';

import './index.scss';

defineOptions({
  name: 'DataTable',
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    columns?: TableColumnList;
    data?: any[];
    loading?: boolean;
    pagination?: DataTablePagination | null;
    size?: '' | 'default' | 'small' | 'large';
    adaptive?: DataTableAdaptiveMode;
    adaptiveConfig?: DataTableAdaptiveConfig;
    alignWhole?: string;
    headerAlign?: string;
    border?: boolean;
    highlightCurrentRow?: boolean;
    rowKey?: string | ((row: any) => string);
    tableLayout?: 'fixed' | 'auto';
    headerCellStyle?: Record<string, string>;
    showOverflowTooltip?: boolean;
  }>(),
  {
    columns: () => [],
    data: () => [],
    loading: false,
    pagination: null,
    size: 'default',
    adaptive: false,
    adaptiveConfig: () => ({
      offsetBottom: DEFAULT_ADAPTIVE_OFFSET_BOTTOM,
      debounceMs: DEFAULT_ADAPTIVE_DEBOUNCE_MS,
      minHeight: MIN_ADAPTIVE_TABLE_HEIGHT_PX,
    }),
    alignWhole: 'left',
    headerAlign: '',
    border: false,
    highlightCurrentRow: false,
    tableLayout: 'fixed',
    showOverflowTooltip: true,
  }
);

const emit = defineEmits<{
  'page-size-change': [size: number];
  'page-current-change': [page: number];
  'selection-change': [rows: any[]];
}>();

const attrs = useAttrs();
const slots = useSlots();
provide(DATA_TABLE_SLOTS_KEY, slots);

const rootRef = ref<HTMLElement | null>(null);
const tableWrapperRef = ref<HTMLElement | null>(null);
const innerTableRef = ref<InstanceType<typeof ElTable> | null>(null);

const showPagination = computed(() => {
  const p = props.pagination;
  return !!(p && p.currentPage != null && p.pageSize != null);
});

const paginationInnerStyle = computed(() => props.pagination?.style ?? {});
const visibleColumns = computed(() => props.columns.filter(columnVisible));

const { isViewport, isFill, hasAdaptiveHeight, setAdaptive } = useTableHeight({
  rootRef,
  tableWrapperRef,
  adaptive: () => props.adaptive,
  adaptiveConfig: () => props.adaptiveConfig,
  onAfterLayout: () => innerTableRef.value?.doLayout?.(),
});

watch(
  () => props.columns,
  () => {
    if (hasAdaptiveHeight.value) {
      void setAdaptive();
    }
  },
  { deep: true }
);

watch(
  () => props.pagination,
  () => {
    if (hasAdaptiveHeight.value) {
      void setAdaptive();
    }
  },
  { deep: true }
);

/**
 * 分页条外包 class
 */
function paginationWrapClass(align?: 'left' | 'center' | 'right') {
  const suffix = align === 'left' || align === 'center' ? align : 'right';
  return ['data-table__pagination-wrap', `data-table__pagination-wrap--${suffix}`];
}

/**
 * 每页条数变化（不改 props，交由父级）
 */
function handleSizeChange(size: number) {
  emit('page-size-change', size);
}

/**
 * 当前页变化（不改 props，交由父级）
 */
function handleCurrentChange(page: number) {
  emit('page-current-change', page);
}

/**
 * 多选变化
 */
function handleSelectionChange(rows: any[]) {
  emit('selection-change', rows);
}

/**
 * 清空表格多选（与业务层 selectedRows 解耦，由 ListTable 在清空 selectedRows 时调用）。
 */
function clearSelection() {
  innerTableRef.value?.clearSelection();
}

defineExpose({
  setAdaptive,
  getTableRef: () => innerTableRef.value,
  clearSelection,
});
</script>

<template>
  <div
    ref="rootRef"
    v-loading="loading"
    :class="{
      'data-table--viewport': isViewport,
      'data-table--fill': isFill,
    }"
    class="data-table"
  >
    <div class="data-table-inner">
      <div ref="tableWrapperRef" class="data-table__table-wrap">
        <el-table
          ref="innerTableRef"
          :border="border"
          :data="data"
          :header-cell-style="headerCellStyle"
          :height="hasAdaptiveHeight ? '100%' : undefined"
          :highlight-current-row="highlightCurrentRow"
          :row-key="rowKey as any"
          :size="size"
          :table-layout="tableLayout"
          v-bind="attrs"
          @selection-change="handleSelectionChange"
        >
          <DataTableColumn
            v-for="(col, columnIndex) in visibleColumns"
            :key="(col.prop as string) ?? `col-${columnIndex}`"
            :align-whole="alignWhole"
            :column="col"
            :column-index="columnIndex"
            :header-align="headerAlign"
            :show-overflow-tooltip="showOverflowTooltip"
          />

          <template v-if="slots.append" #append>
            <slot name="append" />
          </template>
          <template v-if="slots.empty" #empty>
            <slot name="empty" />
          </template>
        </el-table>
      </div>

      <div v-if="showPagination && pagination" :key="'pagination'" :class="paginationWrapClass(pagination.align)">
        <el-pagination
          :background="pagination.background ?? true"
          :current-page="pagination.currentPage"
          :layout="pagination.layout ?? DEFAULT_PAGINATION_LAYOUT"
          :page-size="pagination.pageSize"
          :page-sizes="pagination.pageSizes ?? DEFAULT_PAGE_SIZES"
          :style="paginationInnerStyle"
          :total="pagination.total"
          class="data-table-pagination"
          @update:page-size="handleSizeChange"
          @update:current-page="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>
