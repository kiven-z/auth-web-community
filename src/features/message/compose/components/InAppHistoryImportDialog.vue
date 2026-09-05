<script lang="ts" setup>
import {
  getInAppSendTaskById,
  getInAppSendTaskPage,
  type InAppSendTaskPageQuery,
  type InAppSendTaskPageRow,
} from '@/features/message/api/in-app-message';
import ListTable, { usePaginationState } from '@/components/table/list-table';
import { addDialog } from '@/components/ui/dialog';
import { errorMessage } from '@/services/feedback/message';
import { useFormPlaceholder } from '@/shared/composables/i18n/use-form-placeholder';
import InAppSendTaskDetailView from '@/features/message/_shared/components/InAppSendTaskDetailView.vue';
import useInAppMessageDetailColumns from '@/features/message/_shared/columns/use-in-app-message-detail-columns';
import useInAppHistoryImportTableColumns from '@/features/message/compose/hooks/use-in-app-history-import-table-columns';
import type { InAppHistoryImportPayload } from '@/features/message/compose/types/compose-import';
import { IN_APP_COMPOSE_PERMS } from '@/features/message/compose/constants/permissions';
import useInAppMessageOptions from '@/features/message/_shared/hooks/options/use-in-app-message-options';
import type { FormInstance } from 'element-plus';
import { h, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { InAppContentType } from '@/features/message/api/models/content-type';

defineOptions({
  name: 'InAppHistoryImportDialog',
});

const emit = defineEmits<{
  import: [payload: InAppHistoryImportPayload];
}>();

const { t } = useI18n();
const ph = useFormPlaceholder();
const { statusOptions, sourceOptions, scopeOptions } = useInAppMessageOptions();
const { columns } = useInAppHistoryImportTableColumns();
const { detailColumns } = useInAppMessageDetailColumns();
const searchFormRef = ref<FormInstance>();
const importingId = ref<string>('');

const historyImportState = usePaginationState<InAppSendTaskPageRow, InAppSendTaskPageQuery>({
  fetchApi: getInAppSendTaskPage,
  searchForm: reactive({
    title: undefined,
    status: undefined,
    sourceType: undefined,
    recipientScopeType: undefined,
    categoryId: undefined,
  }),
});

const { loading, searchForm, fetchTableData, resetQuery } = historyImportState;

/**
 * 打开历史发送任务详情预览
 * @param row 表格行
 */
function openDetailDialog(row: InAppSendTaskPageRow): void {
  addDialog({
    title: t('inAppMessage.title.detail'),
    draggable: true,
    fullscreenIcon: true,
    hideFooter: true,
    contentRenderer: () =>
      h(InAppSendTaskDetailView, {
        taskId: row.id,
        columns: detailColumns.value,
        contentLabel: t('inAppMessage.field.content'),
      }),
  });
}

/**
 * 按历史任务详情导入定稿内容到撰写表单
 * @param row 表格行
 */
async function handleImport(row: InAppSendTaskPageRow): Promise<void> {
  try {
    importingId.value = row.id;
    const detail = await getInAppSendTaskById(row.id);

    emit('import', {
      templateCode: detail.sceneCode,
      title: detail.title,
      body: detail.content,
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
  <div class="in-app-history-import-dialog">
    <el-form
      ref="searchFormRef"
      v-enter-submit="fetchTableData"
      :model="searchForm"
      class="w-full overflow-auto pt-3 pl-8"
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
        <el-button v-auth="IN_APP_COMPOSE_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-auth="IN_APP_COMPOSE_PERMS.QUERY" @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="columns" :state="historyImportState" :title="t('inAppCompose.importHistoryDialogTitle')">
      <template #actions="{ row }">
        <el-button v-auth="IN_APP_COMPOSE_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button
          v-auth="IN_APP_COMPOSE_PERMS.DETAIL"
          :loading="importingId === row.id"
          class="ml-2!"
          link
          type="primary"
          @click="handleImport(row)"
        >
          {{ t('inAppCompose.importTemplateConfirm') }}
        </el-button>
      </template>
    </ListTable>
  </div>
</template>
