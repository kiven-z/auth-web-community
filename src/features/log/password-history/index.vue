<script lang="ts" setup>
import { INSTANT_PICKER_VALUE_FORMAT } from '@/shared/utils/date/dateTime';
import { getPasswordHistoryPage } from '@/features/log/api/passwordHistory';
import ListTable, { usePaginationState } from '@/components/table/ListTable';
import useRemoteUserSearch from '@/components/domain/user/RemoteUserSearch';
import { SYS_LOG_PASSWORD_HISTORY_PERMS } from '@/features/log/password-history/constants/permissions';
import usePasswordHistoryTableAction from '@/features/log/password-history/hooks/usePasswordHistoryTableAction';
import usePasswordHistoryTableColumns from '@/features/log/password-history/hooks/usePasswordHistoryTableColumns';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'LogPasswordHistory',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { columns } = usePasswordHistoryTableColumns();
const searchFormRef = ref<FormInstance>();

const passwordHistoryState = usePaginationState({
  fetchApi: getPasswordHistoryPage,
  searchForm: reactive({
    userId: undefined,
    changeTimeStart: undefined,
    changeTimeEnd: undefined,
    changeIp: undefined,
  }),
});

const { selectedRows, loading, searchForm, fetchTableData, resetQuery } = passwordHistoryState;

const { openDetailDialog, deleteBatchRows } = usePasswordHistoryTableAction({
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
      class="bg-auth-container w-[99/100] overflow-auto pl-8 pt-3"
      inline
    >
      <el-form-item :label="t('passwordHistory.userId')" prop="userId">
        <el-select
          v-model="searchForm.userId"
          :loading="userSearchLoading"
          :placeholder="ph.keyword('passwordHistory.username')"
          :remote-method="loadUserListByKeyword"
          class="w-45!"
          clearable
          filterable
          remote
        >
          <el-option v-for="item in userOptions" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('passwordHistory.changeTime')" prop="changeTimeStart">
        <el-date-picker
          v-model="searchForm.changeTimeStart"
          :placeholder="ph.rangeStart()"
          :value-format="INSTANT_PICKER_VALUE_FORMAT"
          class="w-40!"
          type="datetime"
        />
      </el-form-item>
      <el-form-item prop="changeTimeEnd">
        <el-date-picker
          v-model="searchForm.changeTimeEnd"
          :placeholder="ph.rangeEnd()"
          :value-format="INSTANT_PICKER_VALUE_FORMAT"
          class="w-40!"
          type="datetime"
        />
      </el-form-item>
      <el-form-item :label="t('passwordHistory.changeIp')" prop="changeIp">
        <el-input
          v-model="searchForm.changeIp"
          :placeholder="t('passwordHistory.placeholder.changeIp')"
          class="w-40!"
          clearable
        />
      </el-form-item>

      <el-form-item>
        <el-button
          v-auth="SYS_LOG_PASSWORD_HISTORY_PERMS.QUERY"
          :loading="loading"
          type="primary"
          @click="fetchTableData"
        >
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-auth="SYS_LOG_PASSWORD_HISTORY_PERMS.QUERY" @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="columns" :state="passwordHistoryState" :title="t('passwordHistory.tableTitle')">
      <template #buttons>
        <AuthDropdown
          :items="[
            {
              label: t('buttons.actionBatchDelete'),
              permission: SYS_LOG_PASSWORD_HISTORY_PERMS.DELETE,
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
        <el-button v-auth="SYS_LOG_PASSWORD_HISTORY_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button v-auth="SYS_LOG_PASSWORD_HISTORY_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
          {{ t('buttons.actionDelete') }}
        </el-button>
      </template>
    </ListTable>
  </div>
</template>
