<script lang="ts" setup>
import ListTable from '@/components/table/ListTable';
import DeptRowActions from '@/features/system/dept/components/actions/DeptRowActions.vue';
import useDeptPageState from '@/features/system/dept/hooks/useDeptPageState';
import DeptHeadButtons from '@/features/system/dept/components/actions/DeptHeadButtons.vue';
import useDeptTableColumns from '@/features/system/dept/hooks/columns/useDeptTableColumns';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'DeptTableView',
});

const { t } = useI18n();

const { tableColumns } = useDeptTableColumns();
const deptState = useDeptPageState();
const { fetchTableData } = deptState;

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <ListTable :columns="tableColumns" :state="deptState" :title="t('dept.page.title')">
    <template #buttons>
      <DeptHeadButtons />
    </template>

    <template #actions="{ row }">
      <DeptRowActions :row="row" />
    </template>
  </ListTable>
</template>
