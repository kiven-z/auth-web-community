<script lang="ts" setup>
import type { SpreadsheetImportResult } from '@/api/common/import';
import DataTable from '@/components/table/data-table';
import { SpreadsheetImportDialogExpose } from '@/features/system/_shared/hooks/use-spreadsheet-import-action';
import {
  buildImportErrorReportFilename,
  downloadImportErrorsExcel,
} from '@/features/system/_shared/import/export-import-errors';
import { errorMessage, message } from '@/services/feedback/message';
import { buildExportFilenameStamp } from '@/shared/utils/date/date-time';
import { downloadBlob } from '@/shared/utils/file/download';
import type { UploadFile, UploadProps, UploadRawFile } from 'element-plus';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'SpreadsheetImportPanel' });

interface SpreadsheetImportDialogProps {
  /** 模板文件名（触发浏览器下载时使用） */
  templateFilename: string;
  /**
   * 调用后端导入接口
   * @param file 用户选择的 xlsx 文件
   * @returns 导入结果
   */
  onImport: (file: File) => Promise<SpreadsheetImportResult>;
  /**
   * 调用后端模板下载接口
   * @returns 模板 Blob
   */
  onDownloadTemplate: () => Promise<Blob>;
}

const props = defineProps<SpreadsheetImportDialogProps>();

const { t } = useI18n();

const importing = ref(false);
const downloadingTemplate = ref(false);

const selectedFile = ref<File | null>(null);
const importResult = ref<SpreadsheetImportResult | null>(null);

const errorColumns = computed<TableColumnList>(() => [
  { label: t('import.errorRowIndex'), prop: 'rowIndex', width: 80 },
  { label: t('import.errorMessage'), prop: 'message', minWidth: 200 },
]);

/** 最大上传大小 10MB（字节） */
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * el-upload beforeUpload 钩子：仅做校验，禁止自动上传
 * @param rawFile 待上传文件
 * @returns false 阻止自动上传（选中文件由 @change 承接）
 */
const handleBeforeUpload: UploadProps['beforeUpload'] = (rawFile: UploadRawFile) => {
  if (!rawFile.name.endsWith('.xlsx')) {
    errorMessage(null, { message: t('import.fileTypeInvalid') });
  } else if (rawFile.size > MAX_FILE_SIZE_BYTES) {
    errorMessage(null, { message: t('import.fileLimitExceeded') });
  }
  return false;
};

/**
 * 文件变更时（拖拽或点击选择）记录选中文件，限制只保留最新一个
 * @param uploadFile Element Plus 上传文件对象
 */
function handleFileChange(uploadFile: UploadFile) {
  if (!uploadFile.raw) {
    return;
  }
  selectedFile.value = uploadFile.raw;
  importResult.value = null;
}

/**
 * 点击「开始导入」
 */
async function handleImport() {
  if (!selectedFile.value) {
    errorMessage(null, { message: t('import.fileRequired') });
    return false;
  }
  importing.value = true;
  try {
    const result = await props.onImport(selectedFile.value);
    importResult.value = result;
    if (result.success) {
      message(t('import.importSuccess', { count: result.importedCount }), { type: 'success' });
    } else {
      errorMessage(null, {
        message: t('import.importFailureWithRows', { count: result.errors.length }),
      });
    }
    return result.success;
  } catch (error: unknown) {
    errorMessage(error);
    return false;
  } finally {
    importing.value = false;
  }
}

/**
 * 点击「下载错误报告」
 */
function handleDownloadErrorReport() {
  if (!importResult.value?.errors.length) {
    return;
  }
  const stamp = buildExportFilenameStamp();
  const filename = buildImportErrorReportFilename(props.templateFilename, stamp);
  downloadImportErrorsExcel(importResult.value.errors, filename, [
    { header: t('import.errorRowIndex'), key: 'rowIndex' },
    { header: t('import.errorMessage'), key: 'message' },
  ]);
}

/**
 * 点击「清空错误」
 */
function handleClearErrors() {
  importResult.value = null;
  message(t('import.errorsCleared'), { type: 'success' });
}

/**
 * 点击「下载模板」
 */
async function handleDownloadTemplate() {
  downloadingTemplate.value = true;
  try {
    const blob = await props.onDownloadTemplate();
    downloadBlob(blob, props.templateFilename);
  } catch (error: unknown) {
    errorMessage(error);
  } finally {
    downloadingTemplate.value = false;
  }
}

defineExpose<SpreadsheetImportDialogExpose>({ submitImport: handleImport });
</script>

<template>
  <div class="spreadsheet-import">
    <el-upload
      ref="uploadRef"
      :auto-upload="false"
      :before-upload="handleBeforeUpload"
      :limit="1"
      :show-file-list="true"
      accept=".xlsx"
      class="spreadsheet-import-dialog__uploader"
      drag
      @change="handleFileChange"
    >
      <div class="el-upload__text">{{ t('import.dropOrClickHint') }}</div>
      <template #tip>
        <div class="el-upload__tip">{{ t('import.fileTypeHint') }}</div>
      </template>
    </el-upload>

    <div class="spreadsheet-import-dialog__template-action">
      <el-button :loading="downloadingTemplate" link type="primary" @click="handleDownloadTemplate">
        {{ t('import.downloadTemplate') }}
      </el-button>
    </div>

    <!-- 导入结果：行级错误 -->
    <template v-if="importResult && !importResult.success">
      <el-divider>{{ t('import.importFailureWithRows', { count: importResult.errors.length }) }}</el-divider>

      <div class="spreadsheet-import-dialog__error-actions">
        <el-button size="small" type="primary" @click="handleDownloadErrorReport">
          {{ t('import.downloadErrorReport') }}
        </el-button>
        <el-button size="small" @click="handleClearErrors">
          {{ t('import.clearErrors') }}
        </el-button>
      </div>

      <DataTable
        :columns="errorColumns"
        :data="importResult.errors"
        :max-height="240"
        border
        class="spreadsheet-import-dialog__error-table"
        size="small"
        stripe
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.spreadsheet-import-dialog {
  &__error-actions {
    display: flex;
    gap: 12px;
    margin-bottom: 18px;

    .el-button + .el-button {
      margin-left: 0;
    }
  }

  &__error-table {
    margin-bottom: 18px;
  }
}
</style>
