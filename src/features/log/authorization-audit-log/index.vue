<script lang="ts" setup>
import { getAuthorizationAuditPage } from '@/features/log/api/authorization-audit';
import ListTable, { usePaginationState } from '@/components/table/list-table';
import useRemoteUserSearch from '@/components/domain/system/hooks/use-remote-user-search';
import { SYS_LOG_AUTHORIZATION_AUDIT_PERMS } from '@/features/log/authorization-audit-log/constants/permissions';
import useAuthorizationAuditOptions from '@/features/log/authorization-audit-log/hooks/options/use-authorization-audit-options';
import useAuthorizationAuditTableAction from '@/features/log/authorization-audit-log/hooks/actions/use-authorization-audit-table-action';
import useAuthorizationAuditTableColumns from '@/features/log/authorization-audit-log/hooks/columns/use-authorization-audit-table-columns';
import { useFormPlaceholder } from '@/shared/composables/i18n/use-form-placeholder';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'LogAuthorizationAudit',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { eventTypeOptions } = useAuthorizationAuditOptions();
const { columns } = useAuthorizationAuditTableColumns();
const searchFormRef = ref<FormInstance>();

const auditState = usePaginationState({
  fetchApi: getAuthorizationAuditPage,
  searchForm: reactive({
    eventType: undefined,
    decisionReason: undefined,
    className: undefined,
    createdById: undefined,
  }),
});

const { selectedRows, loading, searchForm, fetchTableData, resetQuery } = auditState;

const { openDetailDialog, deleteBatchRows } = useAuthorizationAuditTableAction({
  fetchTableData,
  selectedRows,
});

const { userOptions, userSearchLoading, loadUserListByKeyword } = useRemoteUserSearch();

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
      class="w-[99/100] overflow-auto bg-auth-container pt-3 pl-8"
      inline
    >
      <el-form-item :label="t('authorizationAudit.eventType')" prop="eventType">
        <el-select
          v-model="searchForm.eventType"
          :placeholder="ph.selectFilter('authorizationAudit.eventType')"
          class="w-45!"
          clearable
        >
          <el-option v-for="item in eventTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('authorizationAudit.decisionReason')" prop="decisionReason">
        <el-input
          v-model="searchForm.decisionReason"
          :placeholder="ph.input('authorizationAudit.decisionReason')"
          class="w-45!"
          clearable
        />
      </el-form-item>

      <el-form-item :label="t('authorizationAudit.className')" prop="className">
        <el-input
          v-model="searchForm.className"
          :placeholder="ph.input('authorizationAudit.className')"
          class="w-45!"
          clearable
        />
      </el-form-item>

      <el-form-item :label="t('table.createdByName')" prop="createdById">
        <el-select
          v-model="searchForm.createdById"
          :loading="userSearchLoading"
          :placeholder="ph.keyword('authorizationAudit.createdBy')"
          :remote-method="loadUserListByKeyword"
          class="w-45!"
          clearable
          filterable
          remote
        >
          <el-option v-for="item in userOptions" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          v-auth="SYS_LOG_AUTHORIZATION_AUDIT_PERMS.QUERY"
          :loading="loading"
          type="primary"
          @click="fetchTableData"
        >
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-auth="SYS_LOG_AUTHORIZATION_AUDIT_PERMS.QUERY" @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="columns" :state="auditState" :title="t('authorizationAudit.tableTitle')">
      <template #buttons>
        <AuthDropdown
          :items="[
            {
              label: t('buttons.actionBatchDelete'),
              permission: SYS_LOG_AUTHORIZATION_AUDIT_PERMS.DELETE,
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
        <el-button v-auth="SYS_LOG_AUTHORIZATION_AUDIT_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button
          v-auth="SYS_LOG_AUTHORIZATION_AUDIT_PERMS.DELETE"
          link
          type="danger"
          @click="deleteBatchRows([row.id])"
        >
          {{ t('buttons.actionDelete') }}
        </el-button>
      </template>
    </ListTable>
  </div>
</template>
