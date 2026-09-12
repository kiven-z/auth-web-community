<script lang="ts" setup>
import {
  getInAppSendTaskRecipientPage,
  type InAppRecipientScopeType,
  type InAppSendTaskRecipientPageQuery,
  type InAppSendTaskRecipientPageRow,
} from '@/features/message/api/in-app-message';
import ListTable, { usePaginationState } from '@/components/table/list-table';
import useRemoteUserSearch from '@/components/domain/user/remote-user-search';
import { useFormPlaceholder } from '@/shared/composables/i18n/use-form-placeholder';
import { IN_APP_MESSAGE_PERMS } from '@/features/message/in-app-message/constants/permissions';
import useInAppMessageRecipientTableColumns from '@/features/message/in-app-message/hooks/columns/use-in-app-message-recipient-table-columns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'InAppSendTaskRecipientDrawer',
});

/** 站内信任务收件人抽屉入参 */
interface InAppSendTaskRecipientDrawerProps {
  /** 任务 ID */
  taskId: string;
  /** 任务标题（展示用） */
  title?: string | null;
  /** 接收范围类型，用于提示文案 */
  recipientScopeType: InAppRecipientScopeType;
}

const props = defineProps<InAppSendTaskRecipientDrawerProps>();

const { t } = useI18n();
const ph = useFormPlaceholder();
const { columns } = useInAppMessageRecipientTableColumns();
const searchFormRef = ref<FormInstance>();
const { userOptions, userSearchLoading, loadUserListByKeyword } = useRemoteUserSearch();

const recipientState = usePaginationState<InAppSendTaskRecipientPageRow, InAppSendTaskRecipientPageQuery>({
  searchForm: reactive<InAppSendTaskRecipientPageQuery>({
    userId: undefined,
    isRead: undefined,
    isDeleted: undefined,
  }),
  fetchApi: (query) => getInAppSendTaskRecipientPage(props.taskId, query),
});
const { fetchTableData, resetQuery, loading, searchForm } = recipientState;

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div class="in-app-send-task-recipient-drawer">
    <el-alert
      :closable="false"
      :title="recipientScopeType === 'ALL' ? t('inAppMessage.recipient.pullTip') : t('inAppMessage.recipient.pushTip')"
      show-icon
      type="info"
    />

    <el-form ref="searchFormRef" v-enter-submit="fetchTableData" :model="searchForm" class="pt-2 pl-6" inline>
      <el-form-item :label="t('inAppMessage.field.userId')" prop="userId">
        <el-select
          v-model="searchForm.userId"
          :loading="userSearchLoading"
          :placeholder="ph.keyword('inAppMessage.field.userId')"
          :remote-method="loadUserListByKeyword"
          class="w-45!"
          clearable
          filterable
          remote
        >
          <el-option v-for="item in userOptions" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('inAppMessage.field.readStatus')" prop="isRead">
        <el-select
          v-model="searchForm.isRead"
          :placeholder="ph.selectFilter('inAppMessage.field.readStatus')"
          class="w-45!"
          clearable
        >
          <el-option :label="t('inAppMessage.readStatus.unread')" :value="false" />
          <el-option :label="t('inAppMessage.readStatus.read')" :value="true" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('inAppMessage.field.deletedStatus')" prop="isDeleted">
        <el-select
          v-model="searchForm.isDeleted"
          :placeholder="ph.selectFilter('inAppMessage.field.deletedStatus')"
          class="w-45!"
          clearable
        >
          <el-option :label="t('inAppMessage.deletedStatus.active')" :value="false" />
          <el-option :label="t('inAppMessage.deletedStatus.deleted')" :value="true" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button v-auth="IN_APP_MESSAGE_PERMS.DETAIL" :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-auth="IN_APP_MESSAGE_PERMS.DETAIL" @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="columns" :state="recipientState" :title="title || t('inAppMessage.title.recipients')" />
  </div>
</template>
