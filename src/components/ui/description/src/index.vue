<script lang="ts" setup>
import { copyToClipboard } from '@/shared/utils/clipboard';
import { CopyDocument } from '@element-plus/icons-vue';
import get from 'lodash/get';
import { computed, isVNode } from 'vue';
import { ColumnProps, Row, RowKey, RowKeyProp } from './types';

defineOptions({
  name: 'UiDescription',
});

/**
 * 属性
 */
const props = withDefaults(
  defineProps<{
    columns: ColumnProps[];
    data: Row | Row[];
    title?: string;
    column?: number;
    border?: boolean;
    placeholder?: string;
    rowKey?: RowKeyProp;
  }>(),
  {
    column: 3,
    border: true,
    placeholder: '-',
    rowKey: 'id',
  }
);

/**
 * 行数据
 */
const rows = computed<Row[]>(() => {
  return Array.isArray(props.data) ? props.data : [props.data];
});

/**
 * 获取描述项属性
 * @param item 描述项
 * @returns 描述项属性
 */
const getItemProps = (item: ColumnProps) => {
  const { label, prop, copy, cellRenderer, labelRenderer, ...rest } = item;
  return { label, ...rest };
};

/**
 * 获取值
 * @param row 行数据
 * @param item 描述项
 * @returns 值
 */
const getValue = (row: Row, item: ColumnProps) => {
  return get(row, item.prop);
};

/**
 * 获取行键
 * @param row 行数据
 * @param index 索引
 * @returns 行键
 */
const getRowKey = (row: Row, index: number): RowKey => {
  if (typeof props.rowKey === 'function') return props.rowKey(row, index);
  const key = props.rowKey;
  const v = key ? row?.[key] : undefined;
  return (v ?? index) as RowKey;
};

/**
 * 是否可以复制
 * @param value 值
 * @returns 是否可以复制
 */
const canCopy = (value: any) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim() !== '';
  return true;
};

/**
 * 格式化值
 * @param value 值
 * @returns 格式化后的值
 */
const formatValue = (value: any) => {
  if (value === undefined || value === null || value === '') return props.placeholder;
  return value;
};

/**
 * 解析单元格渲染结果
 * @param row 行数据
 * @param item 描述项
 * @param index 行下标
 * @returns 渲染内容
 */
const resolveCellContent = (row: Row, item: ColumnProps, index: number) => {
  return item.cellRenderer?.({
    value: getValue(row, item),
    data: props.data,
    index,
    row,
  });
};
</script>

<template>
  <div>
    <div v-if="columns.length">
      <!-- 数组 -> 多个描述 (一行一个表格) -->
      <template v-if="Array.isArray(data)">
        <el-descriptions
          v-for="(row, rowIndex) in rows"
          :key="getRowKey(row, rowIndex)"
          :border="border"
          :column="column"
          :title="rowIndex === 0 ? title : undefined"
          v-bind="$attrs"
        >
          <el-descriptions-item
            v-for="item in columns"
            :key="`${getRowKey(row, rowIndex)}-${item.prop}`"
            v-bind="getItemProps(item)"
          >
            <template v-if="item.labelRenderer" #label>
              <component :is="item.labelRenderer({ data })" />
            </template>

            <span class="re-description__cell">
              <template v-if="item.cellRenderer">
                <template
                  v-for="content in [resolveCellContent(row, item, rowIndex)]"
                  :key="isVNode(content) ? `vnode-${item.prop}` : String(content ?? '')"
                >
                  <component :is="content" v-if="isVNode(content)" />
                  <span v-else class="re-description__value">{{ formatValue(content) }}</span>
                </template>
              </template>
              <template v-else>
                <span class="re-description__value">{{ formatValue(getValue(row, item)) }}</span>
              </template>
              <el-icon
                v-if="item.copy && canCopy(getValue(row, item))"
                :size="16"
                class="re-description__copy-icon"
                color="var(--el-color-primary)"
                @click="copyToClipboard(getValue(row, item))"
              >
                <CopyDocument />
              </el-icon>
            </span>
          </el-descriptions-item>
        </el-descriptions>
      </template>

      <!-- 单个对象 -> 单个描述 -->
      <el-descriptions v-else :border="border" :column="column" :title="title" v-bind="$attrs">
        <el-descriptions-item v-for="item in columns" :key="item.prop" v-bind="getItemProps(item)">
          <template v-if="item.labelRenderer" #label>
            <component :is="item.labelRenderer({ data })" />
          </template>

          <span class="re-description__cell">
            <template v-if="item.cellRenderer">
              <template
                v-for="content in [resolveCellContent(rows[0], item, 0)]"
                :key="isVNode(content) ? `vnode-${item.prop}` : String(content ?? '')"
              >
                <component :is="content" v-if="isVNode(content)" />
                <span v-else class="re-description__value">{{ formatValue(content) }}</span>
              </template>
            </template>
            <template v-else>
              <span class="re-description__value">{{ formatValue(getValue(rows[0], item)) }}</span>
            </template>
            <el-icon
              v-if="item.copy && canCopy(getValue(rows[0], item))"
              :size="16"
              class="re-description__copy-icon"
              color="var(--el-color-primary)"
              @click="copyToClipboard(getValue(rows[0], item))"
            >
              <CopyDocument />
            </el-icon>
          </span>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <el-empty v-else />
  </div>
</template>

<style scoped>
.re-description__cell {
  display: inline-flex;
  align-items: center;
}

.re-description__copy-icon {
  margin-left: 4px;
  cursor: pointer;
}
</style>
