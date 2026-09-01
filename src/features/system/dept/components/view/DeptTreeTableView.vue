<script lang="ts" setup>
import ListTable from '@/components/table/list-table';
import DeptRowActions from '@/features/system/dept/components/actions/DeptRowActions.vue';
import DeptHeadButtons from '@/features/system/dept/components/actions/DeptHeadButtons.vue';
import useDeptTableColumns from '@/features/system/dept/hooks/columns/use-dept-table-columns';
import useDeptPageState from '@/features/system/dept/hooks/use-dept-page-state';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'DeptTreeTableView',
});

const treeProps = {
  children: 'children',
  hasChildren: 'hasChildren',
} as const;

const { t } = useI18n();

const { tableColumns } = useDeptTableColumns();
const { treeTableListState, loadTreeListInto } = useDeptPageState();

onMounted(() => {
  loadTreeListInto('table');
});
</script>

<template>
  <ListTable
    :columns="tableColumns"
    :default-expand-all="true"
    :state="treeTableListState"
    :title="t('dept.page.title')"
    :tree-props="treeProps"
  >
    <template #buttons>
      <DeptHeadButtons />
    </template>

    <template #actions="{ row }">
      <DeptRowActions :row="row" />
    </template>
  </ListTable>
</template>
