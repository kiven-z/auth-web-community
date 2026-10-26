<script lang="ts" setup>
import type { DeptSelectTreeNode } from './types';

defineOptions({
  name: 'DeptSelectOptionLabel',
});

defineProps<{
  /** cascader / tree 节点数据 */
  data: DeptSelectTreeNode;
}>();
</script>

<template>
  <span>{{ data.label }}</span>
  <el-text type="info">({{ data.deptCode }})</el-text>
</template>
