<script lang="ts" setup>
import { renderDeptStatusTag } from '@/components/domain/system/status/dept-status-tag';
import { computed, isVNode } from 'vue';
import type { DeptSelectTreeNode } from './types';

defineOptions({
  name: 'DeptSelectOptionLabel',
});

const props = defineProps<{
  /** cascader / tree 节点数据 */
  data: DeptSelectTreeNode;
}>();

const statusTag = computed(() =>
  renderDeptStatusTag(
    { status: props.data.status, effective: props.data.effective },
    { omitActive: true, size: 'small' }
  )
);
</script>

<template>
  <span :class="{ 'text-(--el-text-color-secondary)': data.disabled || data.effective === false || !data.status }">
    {{ data.label }}
  </span>
  <el-text type="info">({{ data.deptCode }})</el-text>
  <span v-if="isVNode(statusTag)" class="ml-1 inline-flex">
    <component :is="statusTag" />
  </span>
</template>
