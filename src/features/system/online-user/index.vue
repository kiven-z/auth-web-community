<script lang="ts" setup>
import { getOnlineUserPage, type OnlineUserPageRow } from '@/api/auth/online-user';
import ListTable, { usePaginationState } from '@/components/table/list-table';
import useRemoteUserSearch from '@/components/domain/system/hooks/use-remote-user-search';
import { useFormPlaceholder } from '@/shared/composables/i18n/use-form-placeholder';
import { SYS_ONLINE_USER_PERMS } from '@/features/system/online-user/constants/permissions';
import useOnlineUserTableAction from '@/features/system/online-user/hooks/use-online-user-table-action';
import useOnlineUserTableColumns from '@/features/system/online-user/hooks/use-online-user-table-columns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'SystemOnlineUser',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { columns } = useOnlineUserTableColumns();
const searchFormRef = ref<FormInstance>();

const searchForm = reactive({
  userId: undefined as string,
});

const tableState = usePaginationState<OnlineUserPageRow>({
  searchForm,
  fetchApi: getOnlineUserPage,
});
const { loading, fetchTableData, pagination, resetQuery } = tableState;

const { userOptions, userSearchLoading, loadUserListByKeyword } = useRemoteUserSearch();

const { kickingUserId, openViewSessionsDialog, kickAllSessionsRow } = useOnlineUserTableAction({
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
      class="w-[99/100] overflow-auto bg-auth-container pt-3 pl-8"
      inline
    >
      <el-form-item :label="t('onlineUser.field.user')" prop="userId">
        <el-select
          v-model="searchForm.userId"
          :loading="userSearchLoading"
          :placeholder="ph.keyword('onlineUser.field.user')"
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
        <el-button v-auth="SYS_ONLINE_USER_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-auth="SYS_ONLINE_USER_PERMS.QUERY" @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="columns" :state="tableState" :title="t('routes.onlineUser')" row-key="userId">
      <template #title>
        <h4>{{ t('routes.onlineUser') }}</h4>
        <el-text v-if="!loading" class="ml-3!" type="info">
          {{ t('onlineUser.summary.userCount', { count: pagination.total }) }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="flex flex-wrap items-center gap-x-1">
          <el-button
            v-auth="SYS_ONLINE_USER_PERMS.VIEW_SESSIONS"
            link
            type="primary"
            @click="openViewSessionsDialog(row)"
          >
            {{ t('onlineUser.action.viewSessions') }}
          </el-button>
          <el-button
            v-auth="SYS_ONLINE_USER_PERMS.KICK_ALL"
            :loading="kickingUserId === row.userId"
            link
            type="danger"
            @click="kickAllSessionsRow(row)"
          >
            {{ t('onlineUser.action.kickAll') }}
          </el-button>
        </div>
      </template>
    </ListTable>
  </div>
</template>
