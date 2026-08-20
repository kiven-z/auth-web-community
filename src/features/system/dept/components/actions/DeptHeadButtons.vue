<script lang="ts" setup>
import { SYS_DEPT_PERMS } from '@/features/system/dept/constants/permissions';
import useDeptAdvancedAction from '@/features/system/dept/hooks/actions/useDeptAdvancedAction';
import useDeptTableAction from '@/features/system/dept/hooks/actions/useDeptTableAction';
import useDeptPageState from '@/features/system/dept/hooks/useDeptPageState';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'DeptHeadButtons',
});

const { t } = useI18n();

const { refresh, fetchTableData, viewMode, selectedRows } = useDeptPageState();

const tableActionDeps = {
  fetchTableData,
  refresh,
  viewMode,
  selectedRows,
};

const { openCreateDialog, batchUpdateStatus } = useDeptTableAction(tableActionDeps);

const { openImportDialog, openClosureHealthDialog } = useDeptAdvancedAction({
  refresh,
});

const hasSelection = computed(() => selectedRows.value.length > 0);
</script>

<template>
  <div class="dept-head-buttons">
    <el-button v-auth="SYS_DEPT_PERMS.CREATE" type="primary" @click="openCreateDialog()">
      {{ t('buttons.actionAdd') }}
    </el-button>

    <AuthDropdown
      :items="[
        {
          label: t('buttons.actionBatchEnable'),
          permission: SYS_DEPT_PERMS.UPDATE,
          disabled: !hasSelection,
          onClick: () => batchUpdateStatus(selectedRows, true),
        },
        {
          label: t('buttons.actionBatchDisable'),
          permission: SYS_DEPT_PERMS.UPDATE,
          disabled: !hasSelection,
          onClick: () => batchUpdateStatus(selectedRows, false),
        },
      ]"
    >
      <el-button :disabled="!hasSelection" type="warning">
        {{ t('buttons.actionBatchStatus') }}
      </el-button>
    </AuthDropdown>

    <AuthDropdown
      :items="[
        { label: t('buttons.importExcel'), permission: SYS_DEPT_PERMS.IMPORT, onClick: openImportDialog },
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
