<script lang="ts" setup>
import ListTable, { usePaginationState } from '@/components/table/list-table';
import { EMAIL_TEMPLATE_CHANNEL } from '@/features/message/_shared/constants/channel';
import {
  getMessageTemplatePage,
  type MessageTemplatePageQuery,
  type MessageTemplatePageRow,
} from '@/features/message/api/message-template';
import { EMAIL_TEMPLATE_PERMS } from '@/features/message/email-template/constants/permissions';
import useEmailTemplateTableAction from '@/features/message/email-template/hooks/actions/use-email-template-table-action';
import { useEmailTemplateTableMoreAction } from '@/features/message/email-template/hooks/actions/use-email-template-table-more-action';
import useEmailTemplateTableColumns from '@/features/message/email-template/hooks/columns/use-email-template-table-columns';
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/use-common-boolean-status-options';
import { useFormPlaceholder } from '@/shared/composables/i18n/use-form-placeholder';
import type { FormInstance } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useOpenMessageTemplateRequireFields } from '@/features/message/_shared/hooks/use-open-message-template-require-fields';
import { useOpenMessageTemplateTestSend } from '@/features/message/_shared/hooks/use-open-message-template-test-send';

defineOptions({
  name: 'SystemEmailTemplate',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const booleanStatusOptions = useCommonBooleanStatusOptions();
const { columns } = useEmailTemplateTableColumns();
const searchFormRef = ref<FormInstance>();

const emailTemplateState = usePaginationState<MessageTemplatePageRow, MessageTemplatePageQuery>({
  fetchApi: getMessageTemplatePage,
  searchForm: reactive<MessageTemplatePageQuery>({
    channel: EMAIL_TEMPLATE_CHANNEL,
    templateCode: undefined,
    templateName: undefined,
    subject: undefined,
    status: undefined,
  }),
});

const { loading, selectedRows, searchForm, fetchTableData, resetQuery } = emailTemplateState;

const { openCreateDialog, openEditDialog, openDetailDialog, deleteBatchRows, batchUpdateStatus } =
  useEmailTemplateTableAction({ fetchTableData, selectedRows });

const { openRequireFields } = useOpenMessageTemplateRequireFields();
const { openTestSend } = useOpenMessageTemplateTestSend();
const { openTemplateContentEdit } = useEmailTemplateTableMoreAction({ fetchTableData });

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
      class="w-[99/100] overflow-auto bg-auth-container pt-3 pl-8"
      inline
    >
      <!-- 场景编码（scene_code） -->
      <el-form-item :label="t('emailTemplate.templateCode')" prop="templateCode">
        <el-input
          v-model="searchForm.templateCode"
          :placeholder="ph.input('emailTemplate.templateCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('emailTemplate.templateName')" prop="templateName">
        <el-input
          v-model="searchForm.templateName"
          :placeholder="ph.input('emailTemplate.templateName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('emailTemplate.subject')" prop="subject">
        <el-input
          v-model="searchForm.subject"
          :placeholder="ph.input('emailTemplate.subject')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('emailTemplate.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('emailTemplate.status')"
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
        <el-button v-auth="EMAIL_TEMPLATE_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-auth="EMAIL_TEMPLATE_PERMS.QUERY" @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="columns" :state="emailTemplateState" :title="t('emailTemplate.tableTitle')">
      <template #buttons>
        <el-button v-auth="EMAIL_TEMPLATE_PERMS.CREATE" type="primary" @click="openCreateDialog">
          {{ t('buttons.actionAdd') }}
        </el-button>

        <AuthDropdown
          :items="[
            {
              label: t('buttons.actionBatchDelete'),
              permission: EMAIL_TEMPLATE_PERMS.DELETE,
              disabled: noSelection,
              onClick: deleteBatchRows,
            },
            {
              label: t('buttons.actionBatchEnable'),
              permission: EMAIL_TEMPLATE_PERMS.UPDATE,
              disabled: noSelection,
              onClick: () => batchUpdateStatus(true),
            },
            {
              label: t('buttons.actionBatchDisable'),
              permission: EMAIL_TEMPLATE_PERMS.UPDATE,
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
        <el-button v-auth="EMAIL_TEMPLATE_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button v-auth="EMAIL_TEMPLATE_PERMS.UPDATE" link type="primary" @click="openEditDialog(row)">
          {{ t('buttons.actionEdit') }}
        </el-button>
        <el-button v-auth="EMAIL_TEMPLATE_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
          {{ t('buttons.actionDelete') }}
        </el-button>
        <AuthDropdown
          :items="[
            {
              label: t('messageTemplate.requireFieldsMenu'),
              permission: EMAIL_TEMPLATE_PERMS.UPDATE,
              onClick: () => openRequireFields({ id: row.id, channel: EMAIL_TEMPLATE_CHANNEL, fetchTableData }),
            },
            {
              label: t('messageTemplate.testSendMenu'),
              permission: EMAIL_TEMPLATE_PERMS.UPDATE,
              onClick: () =>
                openTestSend({
                  id: row.id,
                  channel: EMAIL_TEMPLATE_CHANNEL,
                  targetLabelI18nKey: 'emailTemplate.testSendEmail',
                  targetPlaceholderI18nKey: 'emailTemplate.testSendEmailPlaceholder',
                }),
            },
            {
              label: t('emailTemplate.templateEditMenu'),
              permission: EMAIL_TEMPLATE_PERMS.UPDATE,
              onClick: () => openTemplateContentEdit(row),
            },
          ]"
        >
          <el-button class="ml-2!" link type="primary">{{ t('buttons.actionMore') }}</el-button>
        </AuthDropdown>
      </template>
    </ListTable>
  </div>
</template>
