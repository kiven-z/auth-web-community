<script lang="ts" setup>
import { ref } from 'vue';
import ThemeLabSection from './ThemeLabSection.vue';

defineOptions({
  name: 'TableHighlightSection',
});

interface DemoRow {
  id: string;
  name: string;
  status: string;
}

const tableRows: DemoRow[] = [
  { id: '1', name: '行 A', status: '启用' },
  { id: '2', name: '行 B', status: '禁用' },
  { id: '3', name: '行 C', status: '启用' },
];

const currentRowId = ref<string>('1');

/**
 * 点行高亮（吃 primary-light-9 ← brand-1）
 * @param row 当前行
 */
function handleCurrentChange(row: DemoRow | undefined): void {
  currentRowId.value = row?.id ?? '';
}
</script>

<template>
  <ThemeLabSection hint="highlight-current-row 背景吃 primary-light-9；点一行看浅底是否脏" title="表格选中行">
    <el-table
      :current-row-key="currentRowId"
      :data="tableRows"
      highlight-current-row
      row-key="id"
      style="width: 100%"
      @current-change="handleCurrentChange"
    >
      <el-table-column label="ID" prop="id" width="80" />
      <el-table-column label="名称" prop="name" />
      <el-table-column label="状态" prop="status" width="100">
        <template v-slot="{ row }">
          <el-text v-if="row.status === '启用'" type="success">{{ row.status }}</el-text>
          <el-text v-else-if="row.status === '禁用'" type="danger">{{ row.status }}</el-text>
          <el-text v-else>{{ row.status }}</el-text>
        </template>
      </el-table-column>
    </el-table>
  </ThemeLabSection>
</template>
