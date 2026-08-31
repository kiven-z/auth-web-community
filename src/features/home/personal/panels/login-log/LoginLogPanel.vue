<script lang="ts" setup>
import { getMyLoginLogPage } from '@/features/system/api/user/userMe';
import ListTable, { usePaginationState } from '@/components/table/ListTable';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import useMeLoginLogTableColumns from '@/features/home/personal/panels/login-log/hooks/useMeLoginLogTableColumns';
import useLoginLogOptions from '@/components/domain/log/LoginLogOptions';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'PersonalLoginLogPanel',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { loginResultOptions, loginTypeOptions } = useLoginLogOptions();
const { meLoginLogTableColumns } = useMeLoginLogTableColumns();
const searchFormRef = ref<FormInstance>();

const loginLogState = usePaginationState({
  fetchApi: (params) => getMyLoginLogPage(params),
  searchForm: reactive({
    loginResult: undefined,
    loginType: undefined,
  }),
});

const { loading, fetchTableData, resetQuery } = loginLogState;

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div class="account-login-log list-table-host">
    <el-form
      ref="searchFormRef"
      v-enter-submit="fetchTableData"
      :model="loginLogState.searchForm"
      class="account-login-log__filter"
      inline
    >
      <el-form-item :label="t('loginLog.field.loginResult')" prop="loginResult">
        <el-select
          v-model="loginLogState.searchForm.loginResult"
          :placeholder="ph.selectFilter('loginLog.field.loginResult')"
          class="account-login-log__select"
          clearable
        >
          <el-option v-for="item in loginResultOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('loginLog.field.loginType')" prop="loginType">
        <el-select
          v-model="loginLogState.searchForm.loginType"
          :placeholder="ph.selectFilter('loginLog.field.loginType')"
          class="account-login-log__select"
          clearable
        >
          <el-option v-for="item in loginTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <el-alert :closable="false" class="account-login-log__hint" show-icon type="info">
      {{ t('account.hint.loginLogRetention') }}
    </el-alert>

    <ListTable
      :columns="meLoginLogTableColumns"
      :state="loginLogState"
      :title="t('account.loginLog')"
      adaptive="fill"
    />
  </div>
</template>

<style lang="scss" scoped>
.account-login-log {
  &__filter {
    flex-shrink: 0;
    width: 99%;
    padding: 4px 0 0 8px;
    overflow: auto;
    background: var(--el-bg-color);
  }

  &__select {
    width: 180px;
  }

  &__hint {
    flex-shrink: 0;
    margin: 0 8px;
  }
}
</style>
