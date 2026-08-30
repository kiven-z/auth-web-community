<script lang="ts" setup>
import {
  getMessageTemplatePage,
  type MessageTemplatePageQuery,
  type MessageTemplatePageRow,
} from '@/features/message/api/messageTemplate';
import ListTable, { usePaginationState } from '@/components/table/ListTable';
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/useCommonBooleanStatusOptions';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { SMS_TEMPLATE_CHANNEL } from '@/features/message/_shared/constants/channel';
import { SMS_TEMPLATE_PERMS } from '@/features/message/sms-template/constants/permissions';
import useSmsTemplateTableAction from '@/features/message/sms-template/hooks/actions/useSmsTemplateTableAction';
import useSmsTemplateTableColumns from '@/features/message/sms-template/hooks/columns/useSmsTemplateTableColumns';
import { useOpenMessageTemplateRequireFields } from '@/features/message/_shared/hooks/useOpenMessageTemplateRequireFields';
import { useOpenMessageTemplateTestSend } from '@/features/message/_shared/hooks/useOpenMessageTemplateTestSend';
import type { FormInstance } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'SystemSmsTemplate',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const booleanStatusOptions = useCommonBooleanStatusOptions();
const { columns } = useSmsTemplateTableColumns();
const searchFormRef = ref<FormInstance>();

const smsTemplateState = usePaginationState<MessageTemplatePageRow, MessageTemplatePageQuery>({
  fetchApi: getMessageTemplatePage,
  searchForm: reactive<MessageTemplatePageQuery>({
    channel: SMS_TEMPLATE_CHANNEL,
    templateCode: undefined,
    templateName: undefined,
    status: undefined,
  }),
});

const { loading, selectedRows, searchForm, fetchTableData, resetQuery } = smsTemplateState;
const { openCreateDialog, openEditDialog, openDetailDialog, deleteBatchRows, batchUpdateStatus } =
  useSmsTemplateTableAction({
    fetchTableData,
    selectedRows,
  });
const { openRequireFields } = useOpenMessageTemplateRequireFields();
const { openTestSend } = useOpenMessageTemplateTestSend();

const noSelection = computed(() => selectedRows.value.length <= 0);

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
      <!-- 场景编码（scene_code） -->
      <el-form-item :label="t('smsTemplate.templateCode')" prop="templateCode">
        <el-input
          v-model="searchForm.templateCode"
          :placeholder="ph.input('smsTemplate.templateCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('smsTemplate.templateName')" prop="templateName">
        <el-input
          v-model="searchForm.templateName"
          :placeholder="ph.input('smsTemplate.templateName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('smsTemplate.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('smsTemplate.status')"
          class="w-45!"
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
        <el-button v-auth="SMS_TEMPLATE_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-auth="SMS_TEMPLATE_PERMS.QUERY" @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="columns" :state="smsTemplateState" :title="t('smsTemplate.tableTitle')">
      <template #buttons>
        <el-button v-auth="SMS_TEMPLATE_PERMS.CREATE" type="primary" @click="openCreateDialog">
          {{ t('buttons.actionAdd') }}
        </el-button>

        <AuthDropdown
          :items="[
            {
              label: t('buttons.actionBatchDelete'),
              permission: SMS_TEMPLATE_PERMS.DELETE,
              disabled: noSelection,
              onClick: deleteBatchRows,
            },
            {
              label: t('buttons.actionBatchEnable'),
              permission: SMS_TEMPLATE_PERMS.UPDATE,
              disabled: noSelection,
              onClick: () => batchUpdateStatus(true),
            },
            {
              label: t('buttons.actionBatchDisable'),
              permission: SMS_TEMPLATE_PERMS.UPDATE,
              disabled: noSelection,
              onClick: () => batchUpdateStatus(false),
            },
          ]"
        >
          <el-button type="danger">
            {{ t('buttons.actionAdvanced') }}
          </el-button>
        </AuthDropdown>
      </template>

      <template #actions="{ row }">
        <el-button v-auth="SMS_TEMPLATE_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button v-auth="SMS_TEMPLATE_PERMS.UPDATE" link type="primary" @click="openEditDialog(row)">
          {{ t('buttons.actionEdit') }}
        </el-button>
        <el-button v-auth="SMS_TEMPLATE_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
          {{ t('buttons.actionDelete') }}
        </el-button>
        <AuthDropdown
          :items="[
            {
              label: t('messageTemplate.requireFieldsMenu'),
              permission: SMS_TEMPLATE_PERMS.UPDATE,
              onClick: () => openRequireFields({ id: row.id, channel: SMS_TEMPLATE_CHANNEL, fetchTableData }),
            },
            {
              label: t('messageTemplate.testSendMenu'),
              permission: SMS_TEMPLATE_PERMS.UPDATE,
              onClick: () =>
                openTestSend({
                  id: row.id,
                  channel: SMS_TEMPLATE_CHANNEL,
                  targetLabelI18nKey: 'smsTemplate.testSendPhone',
                  targetPlaceholderI18nKey: 'smsTemplate.testSendPhonePlaceholder',
                }),
            },
          ]"
        >
          <el-button class="ml-2!" link type="primary">{{ t('buttons.actionMore') }}</el-button>
        </AuthDropdown>
      </template>
    </ListTable>
  </div>
</template>
