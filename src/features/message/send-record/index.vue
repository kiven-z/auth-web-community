<script lang="ts" setup>
import { type ChannelDeliveryPageQuery, getChannelDeliveryPage } from '@/features/message/api/channel-delivery';
import ListTable, { usePaginationState } from '@/components/table/ListTable';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { SEND_RECORD_PERMS } from '@/features/message/send-record/constants/permissions';
import useSendRecordOptions from '@/features/message/send-record/hooks/options/useSendRecordOptions';
import useSendRecordTableAction from '@/features/message/send-record/hooks/actions/useSendRecordTableAction';
import useSendRecordTableColumns from '@/features/message/send-record/hooks/columns/useSendRecordTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'MessageSendRecord',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { channelOptions, statusOptions } = useSendRecordOptions();
const { columns } = useSendRecordTableColumns();
const searchFormRef = ref<FormInstance>();

const sendRecordState = usePaginationState({
  fetchApi: getChannelDeliveryPage,
  searchForm: reactive<ChannelDeliveryPageQuery>({
    taskId: undefined,
    channel: undefined,
    status: undefined,
  }),
});
const { selectedRows, loading, searchForm, fetchTableData, resetQuery } = sendRecordState;

const { openDetailDialog, deleteBatchRows } = useSendRecordTableAction({
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
      <el-form-item :label="t('sendRecord.field.taskId')" prop="taskId">
        <el-input
          v-model="searchForm.taskId"
          :placeholder="ph.input('sendRecord.field.taskId')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('sendRecord.field.channel')" prop="channel">
        <el-select
          v-model="searchForm.channel"
          :placeholder="ph.selectFilter('sendRecord.field.channel')"
          class="w-45!"
          clearable
        >
          <el-option v-for="item in channelOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('sendRecord.field.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('sendRecord.field.status')"
          class="w-45!"
          clearable
        >
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button v-auth="SEND_RECORD_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-auth="SEND_RECORD_PERMS.QUERY" @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="columns" :state="sendRecordState" :title="t('sendRecord.title.table')">
      <template #buttons>
        <AuthDropdown
          :items="[
            {
              label: t('buttons.actionBatchDelete'),
              permission: SEND_RECORD_PERMS.DELETE,
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
        <el-button v-auth="SEND_RECORD_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button v-auth="SEND_RECORD_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
          {{ t('buttons.actionDelete') }}
        </el-button>
      </template>
    </ListTable>
  </div>
</template>
