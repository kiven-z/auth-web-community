import useBatchDeleteAction from '@/components/table/BatchDeleteAction';
import { Description } from '@/components/ui/Description';
import { addDialog } from '@/components/ui/Dialog';
import type { FileRecordDetail, FileRecordPageRow } from '@/features/file/api/models/fileRecord';
import { errorMessage, message } from '@/services/feedback/message';
import type { TableActionWithSelectionDeps } from '@/shared/types/tableAction';
import { buildExportFilenameStamp } from '@/shared/utils/date/dateTime';
import { downloadBlob, sanitizeDownloadFilename, type BlobDownloadPayload } from '@/shared/utils/file/download';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useFileRecordDetailColumns from './useFileRecordDetailColumns';

/** 文件记录表格动作核心配置。 */
interface UseFileRecordTableActionCoreOptions extends TableActionWithSelectionDeps {
  /** 批量删除 API。 */
  deleteApi: (ids: string[]) => Promise<unknown>;
  /** 批量下载 API。 */
  downloadApi: (ids: string[]) => Promise<BlobDownloadPayload>;
  /** 详情查询 API。 */
  detailApi: (id: string) => Promise<FileRecordDetail>;
}

/**
 * 从原始文件名取不含扩展名的主干
 * @param originalName 原始文件名
 * @returns 主干名
 */
function fileNameStem(originalName?: string): string {
  const cleaned = sanitizeDownloadFilename(originalName, 'file');
  const lastDot = cleaned.lastIndexOf('.');
  if (lastDot <= 0) {
    return cleaned;
  }
  return cleaned.slice(0, lastDot);
}

/**
 * 文件记录表格动作核心逻辑（删除、下载、详情）。
 * @param options 表格动作依赖与角色 API
 * @returns 表格动作方法与下载状态
 */
function useFileRecordTableActionCore(options: UseFileRecordTableActionCoreOptions) {
  const { fetchTableData, selectedRows, deleteApi, downloadApi, detailApi } = options;
  const { t } = useI18n();
  const { detailColumns } = useFileRecordDetailColumns();
  const batchDownloadLoading = ref<boolean>(false);
  const currentDownloadingRowId = ref<string | null>(null);

  const { deleteBatchRows } = useBatchDeleteAction({ selectedRows, deleteApi, onSuccess: fetchTableData });

  /**
   * 下载单行文件记录。
   * @param row 文件记录行
   * @returns 无返回值
   */
  const downloadRow = async (row: FileRecordPageRow): Promise<void> => {
    if (currentDownloadingRowId.value || batchDownloadLoading.value) {
      return;
    }
    currentDownloadingRowId.value = row.id;
    try {
      const { blob } = await downloadApi([row.id]);
      downloadBlob(blob, `${fileNameStem(row.originalName)}.zip`);
      message(t('fileRecord.messages.downloadSuccess'), { type: 'success' });
    } catch (error: unknown) {
      errorMessage(error);
    } finally {
      currentDownloadingRowId.value = null;
    }
  };

  /**
   * 批量下载已选文件记录。
   * @returns 无返回值
   */
  const downloadBatchRows = async (): Promise<void> => {
    const targetIds = selectedRows.value;
    if (targetIds.length <= 0 || batchDownloadLoading.value || currentDownloadingRowId.value) {
      return;
    }
    batchDownloadLoading.value = true;
    try {
      const { blob, filename } = await downloadApi(targetIds);
      downloadBlob(blob, filename ?? `file-records_${buildExportFilenameStamp()}.zip`);
      message(t('fileRecord.messages.batchDownloadSuccess', { count: targetIds.length }), { type: 'success' });
    } catch (error: unknown) {
      errorMessage(error);
    } finally {
      batchDownloadLoading.value = false;
    }
  };

  /**
   * 打开文件记录详情弹窗。
   * @param row 文件记录行
   * @returns 无返回值
   */
  const openDetailDialog = async (row: FileRecordPageRow): Promise<void> => {
    try {
      const detail = await detailApi(row.id);
      addDialog({
        title: t('fileRecord.dialog.detailTitle'),
        width: '80%',
        draggable: false,
        hideFooter: true,
        contentRenderer: () => <Description column={2} columns={detailColumns.value} data={detail} />,
      });
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  return {
    openDetailDialog,
    deleteBatchRows,
    downloadRow,
    downloadBatchRows,
    batchDownloadLoading,
    currentDownloadingRowId,
  };
}

export default useFileRecordTableActionCore;
