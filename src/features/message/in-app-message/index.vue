<script lang="ts" setup>
import { getInAppSendTaskPage, type InAppSendTaskPageQuery } from '@/features/message/api/in-app-message';
import ListTable, { usePaginationState } from '@/components/table/list-table';
import { useFormPlaceholder } from '@/shared/composables/i18n/use-form-placeholder';
import { IN_APP_MESSAGE_PERMS } from '@/features/message/in-app-message/constants/permissions';
import {
  IN_APP_MESSAGE_DELETABLE_STATUS,
  IN_APP_MESSAGE_RECALLABLE_STATUS,
  IN_APP_MESSAGE_RETRYABLE_STATUS,
} from '@/features/message/in-app-message/constants/task-enums';
import useInAppMessageOptions from '@/features/message/_shared/hooks/options/use-in-app-message-options';
import useInAppMessageTableAction from '@/features/message/in-app-message/hooks/actions/use-in-app-message-table-action';
import useInAppMessageTableColumns from '@/features/message/in-app-message/hooks/columns/use-in-app-message-table-columns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'InAppMessage',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { statusOptions, sourceOptions, scopeOptions } = useInAppMessageOptions();
const { columns } = useInAppMessageTableColumns();
const searchFormRef = ref<FormInstance>();

const inAppMessageState = usePaginationState({
  fetchApi: getInAppSendTaskPage,
  searchForm: reactive<InAppSendTaskPageQuery>({
    title: undefined,
    status: undefined,
    sourceType: undefined,
    recipientScopeType: undefined,
    categoryId: undefined,
  }),
});
const { selectedRows, loading, searchForm, fetchTableData, resetQuery } = inAppMessageState;
const { openDetailDialog, openRecipientsDrawer, retryTask, recallTask, deleteBatchRows } = useInAppMessageTableAction({
  fetchTableData,
  selectedRows,
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
      <el-form-item :label="t('inAppMessage.field.title')" prop="title">
        <el-input
          v-model="searchForm.title"
          :placeholder="ph.input('inAppMessage.field.title')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('inAppMessage.field.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('inAppMessage.field.status')"
          class="w-45!"
          clearable
        >
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('inAppMessage.field.recipientScopeType')" prop="recipientScopeType">
        <el-select
          v-model="searchForm.recipientScopeType"
          :placeholder="ph.selectFilter('inAppMessage.field.recipientScopeType')"
          class="w-45!"
          clearable
        >
          <el-option v-for="item in scopeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('inAppMessage.field.sourceType')" prop="sourceType">
        <el-select
          v-model="searchForm.sourceType"
          :placeholder="ph.selectFilter('inAppMessage.field.sourceType')"
          class="w-45!"
          clearable
        >
          <el-option v-for="item in sourceOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button v-auth="IN_APP_MESSAGE_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-auth="IN_APP_MESSAGE_PERMS.QUERY" @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="columns" :state="inAppMessageState" :title="t('inAppMessage.title.table')">
      <template #buttons>
        <AuthDropdown
          :items="[
            {
              label: t('buttons.actionBatchDelete'),
              permission: IN_APP_MESSAGE_PERMS.DELETE,
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
        <el-button v-auth="IN_APP_MESSAGE_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button v-auth="IN_APP_MESSAGE_PERMS.DETAIL" link type="primary" @click="openRecipientsDrawer(row)">
          {{ t('inAppMessage.action.recipients') }}
        </el-button>
        <!-- 补发：管理端编排 + 非全员 + 可恢复状态 -->
        <el-button
          v-if="
            row.sourceType === 'ADMIN_COMPOSE' &&
            row.recipientScopeType !== 'ALL' &&
            IN_APP_MESSAGE_RETRYABLE_STATUS.has(row.status)
          "
          v-auth="IN_APP_MESSAGE_PERMS.SEND"
          link
          type="warning"
          @click="retryTask(row)"
        >
          {{ t('buttons.actionRetry') }}
        </el-button>
        <!-- 撤回：SUCCESS / PARTIAL / NO_RECIPIENTS -->
        <el-button
          v-if="IN_APP_MESSAGE_RECALLABLE_STATUS.has(row.status)"
          v-auth="IN_APP_MESSAGE_PERMS.RECALL"
          link
          type="warning"
          @click="recallTask(row)"
        >
          {{ t('buttons.actionRecall') }}
        </el-button>
        <!-- 删除：仅终态（排除 PENDING / SENDING） -->
        <el-button
          v-if="IN_APP_MESSAGE_DELETABLE_STATUS.has(row.status)"
          v-auth="IN_APP_MESSAGE_PERMS.DELETE"
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
