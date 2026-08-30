import type { TableActionWithSelectionDeps } from '@/shared/types/tableAction';
import {
  batchUpdateJobStatus,
  createJob,
  deleteJob,
  getJobDetail,
  runJobOnce,
  type SysJobCreateForm,
  type SysJobPageRow,
  type SysJobUpdateForm,
  updateJob,
} from '@/features/schedule/api/job';
import { addDialog } from '@/components/ui/Dialog';
import useBatchDeleteAction from '@/components/table/BatchDeleteAction';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/components/ui/Overlay';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import JobCreateFormDialog from '@/features/schedule/schedule-task/components/JobCreateFormDialog.vue';
import JobDescriptionDialog from '@/features/schedule/schedule-task/components/JobDescriptionDialog.vue';
import JobUpdateFormDialog from '@/features/schedule/schedule-task/components/JobUpdateFormDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { addDrawer } from '@/components/ui/Drawer';

/**
 * 定时任务表格操作：新增弹窗与写接口
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function useJobTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();
  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: async (ids) => {
      await deleteJob(ids[0]);
    },
    onSuccess: fetchTableData,
  });

  /**
   * 打开新增弹窗
   */
  const openCreateDialog = () => {
    const dialogFormRef = ref<FormOverlayExpose<SysJobCreateForm> | null>(null);

    addDrawer({
      title: t('scheduleTask.page.dialogCreateTitle'),
      size: '100%',
      resizable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showClose: true,
      contentRenderer: () => h(JobCreateFormDialog, { ref: dialogFormRef }),
      beforeSure: createFormBeforeSure<SysJobCreateForm>({
        formExposeRef: dialogFormRef,
        successI18nKey: 'tips.addSuccess',
        onSubmit: async (formPayload) => {
          await createJob(formPayload);
          await fetchTableData();
        },
      }),
    });
  };

  /**
   * 打开编辑弹窗
   * @param row 表格行
   */
  const openEditDialog = async (row: SysJobPageRow) => {
    try {
      const detail = await getJobDetail(row.id);
      const dialogFormRef = ref<FormOverlayExpose<SysJobUpdateForm> | null>(null);

      addDrawer({
        title: t('scheduleTask.page.dialogEditTitle'),
        size: '100%',
        resizable: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        showClose: true,
        contentRenderer: () =>
          h(JobUpdateFormDialog, {
            ref: dialogFormRef,
            detail,
          }),
        beforeSure: createFormBeforeSure<SysJobUpdateForm>({
          formExposeRef: dialogFormRef,
          requireId: true,
          successI18nKey: 'tips.editSuccess',
          onSubmit: async (formData) => {
            await updateJob(formData);
            await fetchTableData();
          },
        }),
      });
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  /**
   * 立即执行一次
   * @param row 表格行
   */
  const runOnce = async (row: SysJobPageRow) => {
    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await runJobOnce(row.id);
      message(t('tips.operationSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  /**
   * 批量或单行启停
   * @param ids 任务主键列表
   * @param enabled 是否启用调度
   */
  const batchUpdateStatus = async (ids: string[], enabled: boolean) => {
    if (ids.length <= 0) {
      return;
    }

    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await batchUpdateJobStatus({ ids, status: enabled });
      message(t('tips.editSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  /**
   * 查看详情
   * @param row 表格行
   */
  const openDetailDialog = async (row: SysJobPageRow) => {
    try {
      const detail = await getJobDetail(row.id);
      addDialog({
        title: t('scheduleTask.page.dialogViewTitle'),
        draggable: true,
        fullscreenIcon: true,
        hideFooter: true,
        contentRenderer: () => h(JobDescriptionDialog, { data: detail }),
      });
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  return {
    openCreateDialog,
    openDetailDialog,
    openEditDialog,
    runOnce,
    deleteBatchRows,
    batchUpdateStatus,
  };
}

export default useJobTableAction;
