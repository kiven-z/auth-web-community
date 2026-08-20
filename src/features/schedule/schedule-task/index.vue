<script lang="ts" setup>
import { getJobPage } from '@/features/schedule/api/job';
import ListTable, { usePaginationState } from '@/components/table/ListTable';
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/useCommonBooleanStatusOptions';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { SYS_JOB_PERMS } from '@/features/schedule/schedule-task/constants/permissions';
import useJobTableAction from '@/features/schedule/schedule-task/hooks/useJobTableAction';
import useJobTableColumns from '@/features/schedule/schedule-task/hooks/columns/useJobTableColumns';
import type { FormInstance } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'ScheduleTask',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const booleanStatusOptions = useCommonBooleanStatusOptions();
const { columns } = useJobTableColumns();
const searchFormRef = ref<FormInstance>();

const jobState = usePaginationState({
  fetchApi: getJobPage,
  searchForm: reactive({
    jobName: undefined,
    jobGroup: undefined,
    status: undefined,
  }),
});

const { loading, selectedRows, searchForm, fetchTableData, resetQuery } = jobState;

const { openCreateDialog, openDetailDialog, openEditDialog, runOnce, deleteBatchRows, batchUpdateStatus } =
  useJobTableAction({
    fetchTableData,
    selectedRows,
  });

const noSelection = computed(() => selectedRows.value.length <= 0);

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <el-form
      ref="searchFormRef"
      v-enter-submit="fetchTableData"
      :model="searchForm"
      class="bg-auth-container w-[99/100] overflow-auto pl-8 pt-3"
      inline
    >
      <el-form-item :label="t('scheduleTask.fields.jobName')" prop="jobName">
        <el-input
          v-model="searchForm.jobName"
          :placeholder="ph.input('scheduleTask.fields.jobName')"
          class="w-40!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('scheduleTask.fields.jobGroup')" prop="jobGroup">
        <el-input
          v-model="searchForm.jobGroup"
          :placeholder="ph.input('scheduleTask.fields.jobGroup')"
          class="w-40!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('scheduleTask.fields.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('scheduleTask.fields.status')"
          class="w-40!"
          clearable
        >
          <el-option
            v-for="opt in booleanStatusOptions"
            :key="String(opt.value)"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button v-auth="SYS_JOB_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-auth="SYS_JOB_PERMS.QUERY" @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="columns" :state="jobState" :title="t('scheduleTask.page.tableTitle')">
      <template #buttons>
        <el-button v-auth="SYS_JOB_PERMS.CREATE" type="primary" @click="openCreateDialog">
          {{ t('buttons.actionAdd') }}
        </el-button>

        <AuthDropdown
          :items="[
            {
              label: t('buttons.actionBatchEnable'),
              permission: SYS_JOB_PERMS.UPDATE,
              disabled: noSelection,
              onClick: () => batchUpdateStatus(selectedRows, true),
            },
            {
              label: t('buttons.actionBatchDisable'),
              permission: SYS_JOB_PERMS.UPDATE,
              disabled: noSelection,
              onClick: () => batchUpdateStatus(selectedRows, false),
            },
          ]"
        >
          <el-button :disabled="selectedRows.length <= 0" type="warning">
            {{ t('buttons.actionBatchStatus') }}
          </el-button>
        </AuthDropdown>
      </template>

      <template #actions="{ row }">
        <el-button v-auth="SYS_JOB_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button v-auth="SYS_JOB_PERMS.UPDATE" link type="primary" @click="openEditDialog(row)">
          {{ t('buttons.actionEdit') }}
        </el-button>
        <el-button v-auth="SYS_JOB_PERMS.UPDATE" link type="warning" @click="runOnce(row)">
          {{ t('scheduleTask.actions.runOnce') }}
        </el-button>
        <el-button v-auth="SYS_JOB_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
          {{ t('buttons.actionDelete') }}
        </el-button>
        <AuthDropdown
          :items="[
            {
              label: t('buttons.statusActiveText'),
              permission: SYS_JOB_PERMS.UPDATE,
              disabled: row.status === true,
              onClick: () => batchUpdateStatus([row.id], true),
            },
            {
              label: t('buttons.statusInactiveText'),
              permission: SYS_JOB_PERMS.UPDATE,
              disabled: row.status === false,
              onClick: () => batchUpdateStatus([row.id], false),
            },
          ]"
        >
          <el-button class="ml-2!" link type="primary">{{ t('buttons.actionMore') }}</el-button>
        </AuthDropdown>
      </template>
    </ListTable>
  </div>
</template>
