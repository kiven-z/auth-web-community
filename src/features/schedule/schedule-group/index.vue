<script lang="ts" setup>
import { getJobGroupPage } from '@/features/schedule/api/job-group';
import { SYS_JOB_GROUP_PERMS } from '@/features/schedule/schedule-group/constants/permissions';
import ListTable, { usePaginationState } from '@/components/table/list-table';
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/use-common-boolean-status-options';
import { useFormPlaceholder } from '@/shared/composables/i18n/use-form-placeholder';
import useJobGroupTableAction from '@/features/schedule/schedule-group/hooks/use-job-group-table-action';
import useJobGroupTableColumns from '@/features/schedule/schedule-group/hooks/use-job-group-table-columns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'ScheduleJobGroup',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const booleanStatusOptions = useCommonBooleanStatusOptions();
const { columns } = useJobGroupTableColumns();
const searchFormRef = ref<FormInstance>();

const jobGroupState = usePaginationState({
  fetchApi: getJobGroupPage,
  searchForm: reactive({
    groupCode: undefined,
    groupName: undefined,
    status: undefined,
  }),
});

const { loading, searchForm, fetchTableData, resetQuery } = jobGroupState;

const { openCreateDialog, openEditDialog, openDetailDialog, deleteBatchRows, updateAllJobsStatusInGroup } =
  useJobGroupTableAction({
    fetchTableData,
  });

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
      <el-form-item :label="t('scheduleGroup.code')" prop="groupCode">
        <el-input
          v-model="searchForm.groupCode"
          :placeholder="ph.input('scheduleGroup.code')"
          class="w-40!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('scheduleGroup.name')" prop="groupName">
        <el-input
          v-model="searchForm.groupName"
          :placeholder="ph.input('scheduleGroup.name')"
          class="w-40!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('scheduleGroup.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('scheduleGroup.status')"
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
        <el-button v-auth="SYS_JOB_GROUP_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-auth="SYS_JOB_GROUP_PERMS.QUERY" @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="columns" :state="jobGroupState" :title="t('scheduleGroup.tableTitle')">
      <template #buttons>
        <el-button v-auth="SYS_JOB_GROUP_PERMS.CREATE" type="primary" @click="openCreateDialog">
          {{ t('buttons.actionAdd') }}
        </el-button>
      </template>

      <template #actions="{ row }">
        <el-button v-auth="SYS_JOB_GROUP_PERMS.QUERY" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button v-auth="SYS_JOB_GROUP_PERMS.UPDATE" link type="primary" @click="openEditDialog(row)">
          {{ t('buttons.actionEdit') }}
        </el-button>
        <el-button
          v-auth="SYS_JOB_GROUP_PERMS.DELETE"
          :disabled="row.isSystem"
          link
          type="danger"
          @click="deleteBatchRows([row.id])"
        >
          {{ t('buttons.actionDelete') }}
        </el-button>
        <!-- 更多：分组下任务批量启停 -->
        <AuthDropdown
          :items="[
            {
              label: t('scheduleGroup.actionPauseAllJobs'),
              permission: SYS_JOB_GROUP_PERMS.BATCH_UPDATE_JOBS_IN_GROUP,
              onClick: () => updateAllJobsStatusInGroup(row, false),
            },
            {
              label: t('scheduleGroup.actionResumeAllJobs'),
              permission: SYS_JOB_GROUP_PERMS.BATCH_UPDATE_JOBS_IN_GROUP,
              onClick: () => updateAllJobsStatusInGroup(row, true),
            },
          ]"
        >
          <el-button class="ml-2!" link type="primary">{{ t('buttons.actionMore') }}</el-button>
        </AuthDropdown>
      </template>
    </ListTable>
  </div>
</template>
