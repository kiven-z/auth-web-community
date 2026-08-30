<script lang="ts" setup>
import { getOperationLogPage } from '@/features/log/api/operationLog';
import ListTable, { usePaginationState } from '@/components/table/ListTable';
import useRemoteUserSearch from '@/components/domain/user/RemoteUserSearch';
import { OPERATION_TYPES, REQUEST_METHODS } from '@/features/log/operation-log/constants/operationLogEnums';
import { SYS_LOG_OPERATION_PERMS } from '@/features/log/operation-log/constants/permissions';
import useOperationLogTableAction from '@/features/log/operation-log/hooks/useOperationLogTableAction';
import useOperationLogTableColumns from '@/features/log/operation-log/hooks/useOperationLogTableColumns';
import { useCollapsibleSearchForm } from '@/shared/composables/search/useCollapsibleSearchForm';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'LogOperationLog',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { columns } = useOperationLogTableColumns();
const searchFormRef = ref<FormInstance>();

const operationLogState = usePaginationState({
  fetchApi: getOperationLogPage,
  searchForm: reactive({
    userId: undefined,
    operationType: undefined,
    module: undefined,
    targetType: undefined,
    targetId: undefined,
    requestMethod: undefined,
  }),
});

const { selectedRows, loading, searchForm, fetchTableData, resetQuery } = operationLogState;

const { openDetailDialog, deleteBatchRows } = useOperationLogTableAction({
  fetchTableData,
  selectedRows,
});

const { userOptions, userSearchLoading, loadUserListByKeyword } = useRemoteUserSearch();

const { searchExpanded, showAdvancedSearchToggle, toggleAdvancedSearch } = useCollapsibleSearchForm(6);

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
      <el-form-item :label="t('operationLog.user')" prop="userId">
        <el-select
          v-model="searchForm.userId"
          :loading="userSearchLoading"
          :placeholder="ph.keyword('operationLog.user')"
          :remote-method="loadUserListByKeyword"
          class="w-45!"
          clearable
          filterable
          remote
        >
          <el-option v-for="item in userOptions" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('operationLog.operationType')" prop="operationType">
        <el-select
          v-model="searchForm.operationType"
          :placeholder="ph.selectFilter('operationLog.operationType')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="type in OPERATION_TYPES"
            :key="type"
            :label="t(`operationLog.operationTypeEnum.${type}`)"
            :value="type"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('operationLog.module')" prop="module">
        <el-input v-model="searchForm.module" :placeholder="ph.input('operationLog.module')" class="w-45!" clearable />
      </el-form-item>

      <el-form-item :label="t('operationLog.targetType')" prop="targetType">
        <el-input
          v-model="searchForm.targetType"
          :placeholder="ph.input('operationLog.targetType')"
          class="w-45!"
          clearable
        />
      </el-form-item>

      <template v-if="showAdvancedSearchToggle">
        <el-form-item v-show="searchExpanded" :label="t('operationLog.targetId')" prop="targetId">
          <el-input
            v-model="searchForm.targetId"
            :placeholder="ph.input('operationLog.targetId')"
            class="w-45!"
            clearable
          />
        </el-form-item>

        <el-form-item v-show="searchExpanded" :label="t('operationLog.requestMethod')" prop="requestMethod">
          <el-select
            v-model="searchForm.requestMethod"
            :placeholder="ph.selectFilter('operationLog.requestMethod')"
            class="w-45!"
            clearable
          >
            <el-option v-for="rm in REQUEST_METHODS" :key="rm" :label="rm" :value="rm" />
          </el-select>
        </el-form-item>
      </template>

      <el-form-item>
        <el-button v-auth="SYS_LOG_OPERATION_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-auth="SYS_LOG_OPERATION_PERMS.QUERY" @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
        <el-button v-if="showAdvancedSearchToggle" @click="toggleAdvancedSearch">
          {{ searchExpanded ? t('buttons.actionCollapseSearch') : t('buttons.actionAdvancedSearch') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="columns" :state="operationLogState" :title="t('operationLog.tableTitle')">
      <template #buttons>
        <AuthDropdown
          :items="[
            {
              label: t('buttons.actionBatchDelete'),
              permission: SYS_LOG_OPERATION_PERMS.DELETE,
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
        <el-button v-auth="SYS_LOG_OPERATION_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button v-auth="SYS_LOG_OPERATION_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
          {{ t('buttons.actionDelete') }}
        </el-button>
      </template>
    </ListTable>
  </div>
</template>
