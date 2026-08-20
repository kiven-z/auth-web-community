<script lang="ts" setup>
import type { Slots } from 'vue';
import { computed, inject } from 'vue';

import { DATA_TABLE_SLOTS_KEY } from './context';
import DataTableCell from './render/DataTableCell';
import { columnVisible, resolveCell } from './render/resolveCell';

defineOptions({
  name: 'DataTableColumn',
});

const props = withDefaults(
  defineProps<{
    column: TableColumns;
    columnIndex: number;
    alignWhole?: 'left' | 'center' | 'right' | string;
    headerAlign?: string;
    showOverflowTooltip?: boolean;
  }>(),
  {
    alignWhole: 'left',
    headerAlign: '',
    showOverflowTooltip: true,
  }
);

const slots = inject(DATA_TABLE_SLOTS_KEY, {} as Slots);

const alignDefault = computed(() => (props.alignWhole || 'left') as 'left' | 'center' | 'right');
const headerAlignVal = computed(() => props.headerAlign || props.column.headerAlign || undefined);
const columnKey = computed(() => (props.column.prop as string) ?? `col-${props.columnIndex}`);
const visibleChildren = computed(() =>
  Array.isArray(props.column.children) ? props.column.children.filter(columnVisible) : []
);
const hasChildren = computed(() => visibleChildren.value.length > 0);
const showTip = computed(() => (props.column.showOverflowTooltip ?? props.showOverflowTooltip) as any);

/**
 * 普通列透传给 ElTableColumn 的属性（去掉内部字段）
 */
const passthroughProps = computed(() => {
  const {
    render: _render,
    headerRender: _headerRender,
    slot: _slot,
    children: _children,
    hide: _hide,
    type: _type,
    index: _index,
    ...rest
  } = props.column as TableColumns & Record<string, unknown>;
  return rest;
});
</script>

<template>
  <el-table-column
    v-if="column.type === 'selection'"
    :key="`sel-${columnKey}`"
    :align="(column.align as any) ?? alignDefault"
    :width="column.width as any"
    type="selection"
  />

  <el-table-column
    v-else-if="column.type === 'index'"
    :key="`idx-${columnKey}`"
    :align="(column.align as any) ?? alignDefault"
    :index="column.index as any"
    :label="column.label"
    :min-width="column.minWidth as any"
    :width="column.width as any"
    type="index"
  />

  <el-table-column
    v-else-if="hasChildren"
    :key="`grp-${columnKey}`"
    :align="(column.align as any) ?? alignDefault"
    :header-align="headerAlignVal"
    :label="column.label"
  >
    <DataTableColumn
      v-for="(child, childIdx) in visibleChildren"
      :key="(child.prop as string) ?? `child-${childIdx}`"
      :align-whole="alignWhole"
      :column="child"
      :column-index="childIdx"
      :header-align="headerAlign"
      :show-overflow-tooltip="showOverflowTooltip"
    />
  </el-table-column>

  <el-table-column
    v-else
    :key="columnKey"
    :align="(column.align as any) ?? alignDefault"
    :fixed="column.fixed as any"
    :header-align="headerAlignVal"
    :label="column.label"
    :min-width="column.minWidth as any"
    :prop="column.prop as any"
    :show-overflow-tooltip="showTip"
    :width="column.width as any"
    v-bind="passthroughProps"
  >
    <template v-if="column.headerRender" #header>
      <DataTableCell :content="column.headerRender()" />
    </template>
    <template #default="scope">
      <DataTableCell :content="resolveCell(column, scope, slots)" />
    </template>
  </el-table-column>
</template>
