<script lang="ts" setup>
import {
  getMessageTemplatePage,
  type MessageTemplatePageQuery,
  type MessageTemplatePageRow,
} from '@/features/message/api/message-template';
import ListTable, { usePaginationState } from '@/components/table/list-table';
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/use-common-boolean-status-options';
import { useFormPlaceholder } from '@/shared/composables/i18n/use-form-placeholder';
import { IN_APP_TEMPLATE_CHANNEL } from '@/features/message/_shared/constants/channel';
import { IN_APP_TEMPLATE_PERMS } from '@/features/message/in-app-template/constants/permissions';
import useInAppTemplateTableAction from '@/features/message/in-app-template/hooks/actions/use-in-app-template-table-action';
import { useInAppTemplateTableMoreAction } from '@/features/message/in-app-template/hooks/actions/use-in-app-template-table-more-action';
import useInAppTemplateTableColumns from '@/features/message/in-app-template/hooks/columns/use-in-app-template-table-columns';
import { useOpenMessageTemplateRequireFields } from '@/features/message/_shared/hooks/use-open-message-template-require-fields';
import type { FormInstance } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { IN_APP_CONTENT_TYPES } from '@/features/message/api/models/content-type';

defineOptions({
  name: 'SystemInAppTemplate',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const booleanStatusOptions = useCommonBooleanStatusOptions();
const { columns } = useInAppTemplateTableColumns();
const searchFormRef = ref<FormInstance>();

const inAppTemplateState = usePaginationState<MessageTemplatePageRow, MessageTemplatePageQuery>({
  fetchApi: getMessageTemplatePage,
  searchForm: reactive({
    channel: IN_APP_TEMPLATE_CHANNEL,
    templateCode: undefined,
    templateName: undefined,
    subject: undefined,
    imMessageType: undefined,
    status: undefined,
  }),
});

const { loading, selectedRows, searchForm, fetchTableData, resetQuery } = inAppTemplateState;
const { openCreateDrawer, openEditDrawer, openDetailDialog, deleteBatchRows, batchUpdateStatus } =
  useInAppTemplateTableAction({
    fetchTableData,
    selectedRows,
  });
const { openRequireFields } = useOpenMessageTemplateRequireFields();
const { openTestSend } = useInAppTemplateTableMoreAction();

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
      <el-form-item :label="t('inAppTemplate.templateCode')" prop="templateCode">
        <el-input
          v-model="searchForm.templateCode"
          :placeholder="ph.input('inAppTemplate.templateCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('inAppTemplate.templateName')" prop="templateName">
        <el-input
          v-model="searchForm.templateName"
          :placeholder="ph.input('inAppTemplate.templateName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 标题模板（subject） -->
      <el-form-item :label="t('inAppTemplate.subject')" prop="subject">
        <el-input
          v-model="searchForm.subject"
          :placeholder="ph.input('inAppTemplate.subject')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('inAppTemplate.contentType')" prop="imMessageType">
        <el-select
          v-model="searchForm.imMessageType"
          :placeholder="ph.selectFilter('inAppTemplate.contentType')"
          class="w-45!"
          clearable
        >
          <el-option v-for="type in IN_APP_CONTENT_TYPES" :key="type" :label="type" :value="type" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('inAppTemplate.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('inAppTemplate.status')"
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
        <el-button v-auth="IN_APP_TEMPLATE_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-auth="IN_APP_TEMPLATE_PERMS.QUERY" @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="columns" :state="inAppTemplateState" :title="t('inAppTemplate.tableTitle')">
      <template #buttons>
        <el-button v-auth="IN_APP_TEMPLATE_PERMS.CREATE" type="primary" @click="openCreateDrawer">
          {{ t('buttons.actionAdd') }}
        </el-button>

        <AuthDropdown
          :items="[
            {
              label: t('buttons.actionBatchDelete'),
              permission: IN_APP_TEMPLATE_PERMS.DELETE,
              disabled: noSelection,
              onClick: deleteBatchRows,
            },
            {
              label: t('buttons.actionBatchEnable'),
              permission: IN_APP_TEMPLATE_PERMS.UPDATE,
              disabled: noSelection,
              onClick: () => batchUpdateStatus(true),
            },
            {
              label: t('buttons.actionBatchDisable'),
              permission: IN_APP_TEMPLATE_PERMS.UPDATE,
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
        <el-button v-auth="IN_APP_TEMPLATE_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button v-auth="IN_APP_TEMPLATE_PERMS.UPDATE" link type="primary" @click="openEditDrawer(row)">
          {{ t('buttons.actionEdit') }}
        </el-button>
        <el-button v-auth="IN_APP_TEMPLATE_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
          {{ t('buttons.actionDelete') }}
        </el-button>
        <AuthDropdown
          :items="[
            {
              label: t('messageTemplate.requireFieldsMenu'),
              permission: IN_APP_TEMPLATE_PERMS.UPDATE,
              onClick: () => openRequireFields({ id: row.id, channel: IN_APP_TEMPLATE_CHANNEL, fetchTableData }),
            },
            {
              label: t('messageTemplate.testSendMenu'),
              permission: IN_APP_TEMPLATE_PERMS.UPDATE,
              onClick: () => openTestSend(row),
            },
          ]"
        >
          <el-button class="ml-2!" link type="primary">{{ t('buttons.actionMore') }}</el-button>
        </AuthDropdown>
      </template>
    </ListTable>
  </div>
</template>
