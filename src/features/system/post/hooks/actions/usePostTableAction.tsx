import type { TableActionDeps } from '@/shared/types/tableAction';
import type { SysPostCreateForm, SysPostPageRow, SysPostUpdateForm } from '@/features/system/api/post/post';
import {
  batchUpdatePostStatus,
  createPost,
  deletePost,
  getPostDetail,
  updatePost,
} from '@/features/system/api/post/post';
import { addDialog } from '@/components/ui/Dialog';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/components/ui/Overlay';
import { deleteConfirm, operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import PostDescriptionDialog from '@/features/system/post/components/PostDescriptionDialog.vue';
import PostFormDialog from '@/features/system/post/components/PostFormDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 岗位表格操作：弹窗与写接口
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function usePostTableAction(deps: TableActionDeps) {
  const { fetchTableData } = deps;
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();

  /**
   * 打开新增弹窗
   */
  const openCreateDialog = () => {
    const dialogFormRef = ref<FormOverlayExpose<SysPostCreateForm> | null>(null);

    addDialog({
      title: t('post.dialog.create'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(PostFormDialog, { ref: dialogFormRef }),
      beforeSure: createFormBeforeSure<SysPostCreateForm>({
        formExposeRef: dialogFormRef,
        successI18nKey: 'tips.addSuccess',
        onSubmit: async (formPayload) => {
          await createPost(formPayload);
          await fetchTableData();
        },
      }),
    });
  };

  /**
   * 打开详情弹窗
   * @param row 表格行
   */
  const openDetailDialog = async (row: SysPostPageRow) => {
    try {
      const detail = await getPostDetail(row.id);
      addDialog({
        title: t('post.dialog.view'),
        draggable: true,
        fullscreenIcon: true,
        hideFooter: true,
        contentRenderer: () => h(PostDescriptionDialog, { data: detail }),
      });
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  /**
   * 打开编辑弹窗
   * @param row 表格行
   */
  const openEditDialog = async (row: SysPostPageRow) => {
    try {
      const detail = await getPostDetail(row.id);
      const dialogFormRef = ref<FormOverlayExpose<SysPostUpdateForm> | null>(null);

      addDialog({
        title: t('post.dialog.edit'),
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        contentRenderer: () => h(PostFormDialog, { ref: dialogFormRef, form: detail }),
        beforeSure: createFormBeforeSure<SysPostUpdateForm>({
          formExposeRef: dialogFormRef,
          successI18nKey: 'tips.editSuccess',
          requireId: true,
          onSubmit: async (formData) => {
            await updatePost(formData);
            await fetchTableData();
          },
        }),
      });
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  /**
   * 单行删除
   * @param row 表格行
   */
  const deleteRow = async (row: SysPostPageRow) => {
    const confirmed = await deleteConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await deletePost(row.id);
      message(t('tips.deleteSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  const batchUpdateStatus = async (ids: string[], status: boolean) => {
    if (ids.length <= 0) {
      return;
    }

    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await batchUpdatePostStatus({ ids, status });
      message(t('tips.editSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  return {
    openCreateDialog,
    openDetailDialog,
    openEditDialog,
    deleteRow,
    batchUpdateStatus,
  };
}

export default usePostTableAction;
