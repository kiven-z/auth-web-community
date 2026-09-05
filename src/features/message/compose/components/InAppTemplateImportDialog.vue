<script lang="ts" setup>
import {
  getMessageTemplateById,
  getMessageTemplatePage,
  type MessageTemplatePageQuery,
  type MessageTemplatePageRow,
} from '@/features/message/api/message-template';
import ListTable, { usePaginationState } from '@/components/table/list-table';
import { addDialog } from '@/components/ui/dialog';
import { errorMessage } from '@/services/feedback/message';
import { useFormPlaceholder } from '@/shared/composables/i18n/use-form-placeholder';
import MessageTemplateDetailView from '@/features/message/_shared/components/MessageTemplateDetailView.vue';
import { IN_APP_TEMPLATE_CHANNEL } from '@/features/message/_shared/constants/channel';
import useInAppTemplateImportTableColumns from '@/features/message/compose/hooks/use-in-app-template-import-table-columns';
import type { InAppTemplateImportPayload } from '@/features/message/compose/types/compose-import';
import useInAppTemplateDetailColumns from '@/features/message/_shared/columns/use-in-app-template-detail-columns';
import type { FormInstance } from 'element-plus';
import { h, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { IN_APP_CONTENT_TYPES, InAppContentType } from '@/features/message/api/models/content-type';

defineOptions({
  name: 'InAppTemplateImportDialog',
});

const emit = defineEmits<{
  import: [payload: InAppTemplateImportPayload];
}>();

const { t } = useI18n();
const ph = useFormPlaceholder();
const { columns } = useInAppTemplateImportTableColumns();
const { detailColumns } = useInAppTemplateDetailColumns();
const searchFormRef = ref<FormInstance>();
const importingId = ref<string>('');

const templateImportState = usePaginationState<MessageTemplatePageRow, MessageTemplatePageQuery>({
  fetchApi: getMessageTemplatePage,
  searchForm: reactive({
    channel: IN_APP_TEMPLATE_CHANNEL,
    templateCode: undefined,
    templateName: undefined,
    subject: undefined,
    imMessageType: undefined,
    status: true,
  }),
});

const { loading, searchForm, fetchTableData, resetQuery } = templateImportState;

/**
 * 打开模板详情预览
 * @param row 表格行
 */
function openDetailDialog(row: MessageTemplatePageRow): void {
  addDialog({
    title: t('inAppTemplate.detailDialogTitle'),
    draggable: true,
    fullscreenIcon: true,
    hideFooter: true,
    contentRenderer: () =>
      h(MessageTemplateDetailView, {
        id: row.id,
        channel: IN_APP_TEMPLATE_CHANNEL,
        columns: detailColumns.value,
        contentLabel: t('inAppTemplate.content'),
      }),
  });
}
/**
 * 按来源导入模板到撰写表单
 * @param row 表格行
 * @param source 导入来源
 */
async function handleImport(row: MessageTemplatePageRow, source: string): Promise<void> {
  try {
    importingId.value = row.id;
    const detail = await getMessageTemplateById(row.id, IN_APP_TEMPLATE_CHANNEL);
    const usePreview = source === 'preview';

    emit('import', {
      templateCode: detail.templateCode,
      title: usePreview ? detail.previewSubject : detail.subject,
      body: usePreview ? detail.previewContent : detail.content,
      contentType: detail.contentType as InAppContentType,
      categoryId: detail.categoryId,
      linkUrl: detail.linkUrl,
    });
  } catch (error: unknown) {
    errorMessage(error);
  } finally {
    importingId.value = '';
  }
}

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div class="in-app-template-import-dialog">
    <el-form
      ref="searchFormRef"
      v-enter-submit="fetchTableData"
      :model="searchForm"
      class="w-full overflow-auto pt-3 pl-8"
      inline
    >
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

      <el-form-item>
        <el-button :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button @click="resetQuery(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="columns" :state="templateImportState" :title="t('inAppCompose.importTemplateDialogTitle')">
      <template #actions="{ row }">
        <el-button link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <el-dropdown trigger="click" @command="(command) => handleImport(row, command)">
          <el-button :loading="importingId === row.id" class="ml-2!" link type="primary">
            {{ t('inAppCompose.importTemplateConfirm') }}
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="content">{{ t('inAppCompose.importContent') }}</el-dropdown-item>
              <el-dropdown-item command="preview">{{ t('inAppCompose.importPreview') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </ListTable>
  </div>
</template>
