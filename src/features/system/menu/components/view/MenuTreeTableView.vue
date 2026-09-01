<script lang="ts" setup>
import ListTable from '@/components/table/list-table';
import MenuRowActions from '@/features/system/menu/components/actions/MenuRowActions.vue';
import { SYS_MENU_PERMS } from '@/features/system/menu/constants/permissions';
import useMenuTableAction from '@/features/system/menu/hooks/actions/use-menu-table-action';
import useMenuTableColumns from '@/features/system/menu/hooks/columns/use-menu-table-columns';
import useMenuPageState from '@/features/system/menu/hooks/use-menu-page-state';
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'MenuTreeTableView',
});

const treeProps = {
  children: 'children',
  hasChildren: 'hasChildren',
} as const;

const { t } = useI18n();

const { tableColumns } = useMenuTableColumns();

const { selectedRows, treeTableListState, loadTreeListInto, refresh, viewMode } = useMenuPageState();

const { openCreateDialog, deleteBatchRows, batchUpdateStatus } = useMenuTableAction({
  fetchTableData: () => loadTreeListInto('table'),
  refresh,
  viewMode,
  selectedRows,
});

const noSelection = computed(() => selectedRows.value.length <= 0);

onMounted(() => {
  loadTreeListInto('table');
});
</script>

<template>
  <ListTable
    :columns="tableColumns"
    :default-expand-all="true"
    :state="treeTableListState"
    :title="t('sysMenu.tableTitle')"
    :tree-props="treeProps"
  >
    <template #buttons>
      <el-button v-auth="SYS_MENU_PERMS.CREATE" type="primary" @click="openCreateDialog()">
        {{ t('buttons.actionAdd') }}
      </el-button>

      <AuthDropdown
        :items="[
          {
            label: t('buttons.actionBatchEnable'),
            permission: SYS_MENU_PERMS.UPDATE,
            onClick: () => batchUpdateStatus(selectedRows, true),
          },
          {
            label: t('buttons.actionBatchDisable'),
            permission: SYS_MENU_PERMS.UPDATE,
            onClick: () => batchUpdateStatus(selectedRows, false),
          },
        ]"
      >
        <el-button :disabled="selectedRows.length <= 0" type="warning">
          {{ t('buttons.actionBatchStatus') }}
        </el-button>
      </AuthDropdown>

      <AuthDropdown
        :items="[
          {
            label: t('buttons.actionBatchDelete'),
            permission: SYS_MENU_PERMS.DELETE,
            disabled: noSelection,
            onClick: () => deleteBatchRows(),
          },
        ]"
      >
        <el-button type="danger">{{ t('buttons.actionAdvanced') }}</el-button>
      </AuthDropdown>
    </template>

    <template #actions="{ row }">
      <MenuRowActions :row="row" />
    </template>
  </ListTable>
</template>
