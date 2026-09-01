<script lang="ts" setup>
import { getJobLogPage } from '@/features/log/api/job-log';
import ListTable, { usePaginationState } from '@/components/table/list-table';
import { useFormPlaceholder } from '@/shared/composables/i18n/use-form-placeholder';
import { useCollapsibleSearchForm } from '@/shared/composables/search/use-collapsible-search-form';
import { SYS_JOB_LOG_PERMS } from '@/features/schedule/schedule-log/constants/permissions';
import useJobLogOptions from '@/features/schedule/schedule-log/hooks/options/use-job-log-options';
import useJobLogTableAction from '@/features/schedule/schedule-log/hooks/actions/use-job-log-table-action';
import useJobLogTableColumns from '@/features/schedule/schedule-log/hooks/columns/use-job-log-table-columns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'LogJobLog',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { statusOptions: jobLogStatusOptions, triggerTypeOptions: jobLogTriggerTypeOptions } = useJobLogOptions();
const { columns } = useJobLogTableColumns();
const searchFormRef = ref<FormInstance>();

const jobLogState = usePaginationState({
  fetchApi: getJobLogPage,
  searchForm: reactive({
    jobId: undefined,
    jobName: undefined,
    jobGroup: undefined,
    invokeTarget: undefined,
    triggerType: undefined,
    elapsedTime: undefined,
    status: undefined,
  }),
});

const { selectedRows, loading, searchForm, fetchTableData, resetQuery } = jobLogState;

const { openDetailDialog, deleteBatchRows } = useJobLogTableAction({ fetchTableData, selectedRows });

const { searchExpanded, showAdvancedSearchToggle, toggleAdvancedSearch } = useCollapsibleSearchForm(7);

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
      <el-form-item :label="t('logJob.field.jobId')" prop="jobId">
        <el-input v-model="searchForm.jobId" :placeholder="ph.input('logJob.field.jobId')" class="w-45!" clearable />
      </el-form-item>
      <el-form-item :label="t('logJob.field.jobName')" prop="jobName">
        <el-input
          v-model="searchForm.jobName"
          :placeholder="ph.input('logJob.field.jobName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('logJob.field.jobGroup')" prop="jobGroup">
        <el-input
          v-model="searchForm.jobGroup"
          :placeholder="ph.input('logJob.field.jobGroup')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('logJob.field.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('logJob.field.status')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="opt in jobLogStatusOptions"
            :key="String(opt.value)"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>

      <template v-if="showAdvancedSearchToggle">
        <el-form-item v-show="searchExpanded" :label="t('logJob.field.invokeTarget')" prop="invokeTarget">
          <el-input
            v-model="searchForm.invokeTarget"
            :placeholder="ph.input('logJob.field.invokeTarget')"
            class="w-45!"
            clearable
          />
        </el-form-item>
        <el-form-item v-show="searchExpanded" :label="t('logJob.field.triggerType')" prop="triggerType">
          <el-select
            v-model="searchForm.triggerType"
            :placeholder="ph.selectFilter('logJob.field.triggerType')"
            class="w-45!"
            clearable
          >
            <el-option v-for="opt in jobLogTriggerTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="searchExpanded" :label="t('logJob.field.elapsedTime')" prop="elapsedTime">
          <el-input-number
            v-model="searchForm.elapsedTime"
            :placeholder="ph.input('logJob.field.elapsedTime')"
            class="w-40!"
            clearable
          />
        </el-form-item>
      </template>

      <el-form-item>
        <el-button v-auth="SYS_JOB_LOG_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-auth="SYS_JOB_LOG_PERMS.QUERY" @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
        <el-button v-if="showAdvancedSearchToggle" @click="toggleAdvancedSearch">
          {{ searchExpanded ? t('buttons.actionCollapseSearch') : t('buttons.actionAdvancedSearch') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="columns" :state="jobLogState" :title="t('logJob.title.table')">
      <template #buttons>
        <AuthDropdown
          :items="[
            {
              label: t('buttons.actionBatchDelete'),
              permission: SYS_JOB_LOG_PERMS.DELETE,
              disabled: selectedRows.length <= 0,
              onClick: deleteBatchRows,
            },
          ]"
        >
          <el-button type="danger">
            {{ t('buttons.actionAdvanced') }}
          </el-button>
        </AuthDropdown>
      </template>

      <template #actions="{ row }">
        <el-button v-auth="SYS_JOB_LOG_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button v-auth="SYS_JOB_LOG_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
          {{ t('buttons.actionDelete') }}
        </el-button>
      </template>
    </ListTable>
  </div>
</template>
