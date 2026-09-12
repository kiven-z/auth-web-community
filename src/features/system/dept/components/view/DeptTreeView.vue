<script lang="ts" setup>
import { renderDeptStatusTag } from '@/components/domain/dept/dept-status-tag';
import ElTreePanel from '@/components/table/el-tree-panel';
import DeptHeadButtons from '@/features/system/dept/components/actions/DeptHeadButtons.vue';
import DeptRowActions from '@/features/system/dept/components/actions/DeptRowActions.vue';
import useDeptPageState from '@/features/system/dept/hooks/use-dept-page-state';
import { useDeptTreeDrag } from '@/features/system/dept/hooks/use-dept-tree-drag';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'DeptTreeView',
});

const treeProps = {
  label: 'deptName',
  children: 'children',
} as const;

const { t } = useI18n();

const { loading, treeData, loadTreeListInto } = useDeptPageState();

const { allowDrag, allowDrop, handleNodeDrop } = useDeptTreeDrag({
  treeData,
  onMoved: () => loadTreeListInto('tree'),
});

onMounted(() => {
  loadTreeListInto('tree');
});
</script>

<template>
  <ElTreePanel
    :allow-drag="allowDrag"
    :allow-drop="allowDrop"
    :collapse-all-label="t('dept.page.tree.collapseAll')"
    :draggable="true"
    :expand-all-label="t('dept.page.tree.expandAll')"
    :loading="loading"
    :show-actions-on-hover="true"
    :title="t('dept.page.title')"
    :tree-data="treeData"
    :tree-props="treeProps"
    @refresh="loadTreeListInto('tree')"
    @node-drop="handleNodeDrop"
  >
    <template #toolbar>
      <DeptHeadButtons />
    </template>

    <template #meta="{ data }">
      <span
        :class="{
          'text-(--el-text-color-secondary)': data.effective === false || data.status !== true,
        }"
        class="font-medium"
      >
        {{ data.deptName }}
      </span>
      <el-text type="info">({{ data.deptCode }})</el-text>
      <component :is="renderDeptStatusTag({ status: data.status, effective: data.effective })" />
    </template>

    <template #actions="{ data }">
      <DeptRowActions :row="data" show-add-child />
    </template>
  </ElTreePanel>
</template>
