import type { Ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { deleteConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';

/** {@link useBatchDeleteAction} 配置项 */
interface UseBatchDeleteActionOptions {
  /** 表格多选主键列表（工具栏批量删除未传 ids 时使用） */
  selectedRows: Ref<string[]>;
  /** 删除 API，接收主键数组 */
  deleteApi: (ids: string[]) => Promise<unknown>;
  /** 删除成功后刷新表格 */
  onSuccess: () => Promise<void>;
}

/**
 * 表格批量删除动作：标准两次确认、成功提示、清空多选、刷新列表
 *
 * 模板约定：
 * - 工具栏批量：@click="deleteBatchRows()"
 * - 行内删除：@click="deleteBatchRows([row.id])"
 * @param options 批量删除配置
 * @returns deleteBatchRows 删除方法
 */
function useBatchDeleteAction(options: UseBatchDeleteActionOptions) {
  const { selectedRows, deleteApi, onSuccess } = options;
  const { t } = useI18n();

  /**
   * 批量删除：工具栏调用 deleteBatchRows()；行内调用 deleteBatchRows([row.id])
   *
   * @param ids 主键列表；不传或非法时使用 selectedRows
   */
  const deleteBatchRows = async (ids?: unknown) => {
    // 解析批量删除目标主键
    const targetIds = Array.isArray(ids) ? ids : selectedRows.value;
    if (targetIds.length <= 0) {
      return;
    }

    const confirmed = await deleteConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await deleteApi(targetIds);
      message(t('tips.deleteSuccess'), { type: 'success' });
      selectedRows.value = [];
      await onSuccess();
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  return { deleteBatchRows };
}

export default useBatchDeleteAction;
