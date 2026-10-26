<script lang="ts" setup>
import { SYS_DEPT_PERMS } from '@/features/system/dept/constants/permissions';
import useDeptAdvancedAction from '@/features/system/dept/hooks/actions/use-dept-advanced-action';
import useDeptTableAction from '@/features/system/dept/hooks/actions/use-dept-table-action';
import useDeptPageState from '@/features/system/dept/hooks/use-dept-page-state';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'DeptHeadButtons',
});

const { t } = useI18n();

const { searchForm, refresh, fetchTableData, viewMode, selectedRows } = useDeptPageState();

const tableActionDeps = {
  fetchTableData,
  refresh,
  viewMode,
  selectedRows,
};

const { openCreateDialog } = useDeptTableAction(tableActionDeps);

const { exporting, exportByFilter, openImportDialog, openClosureHealthDialog } = useDeptAdvancedAction({
  searchForm,
  refresh,
});

</script>

<template>
  <div class="dept-head-buttons">
    <el-button v-auth="SYS_DEPT_PERMS.CREATE" type="primary" @click="openCreateDialog()">
      {{ t('buttons.actionAdd') }}
    </el-button>

    <AuthDropdown
      :items="[
        { label: t('buttons.importExcel'), permission: SYS_DEPT_PERMS.IMPORT, onClick: openImportDialog },
        {
          label: t('buttons.exportExcel'),
          permission: SYS_DEPT_PERMS.EXPORT,
          disabled: exporting,
          onClick: exportByFilter,
        },
        {
          label: t('dept.closureHealth.action'),
          permission: SYS_DEPT_PERMS.DIAGNOSE,
          onClick: openClosureHealthDialog,
        },
      ]"
    >
      <el-button type="danger">{{ t('buttons.actionAdvanced') }}</el-button>
    </AuthDropdown>
  </div>
</template>

<style lang="scss" scoped>
.dept-head-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;

  > .el-button + .el-button {
    margin-left: 0;
  }
}
</style>
