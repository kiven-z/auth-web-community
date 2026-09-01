import type {
  InAppMessageCategoryFormModel,
  InAppMessageCategoryPageRow,
} from '@/features/message/api/in-app-category';
import {
  batchDeleteInAppMessageCategories,
  batchUpdateInAppMessageCategoryStatus,
  createInAppMessageCategory,
  getInAppMessageCategoryById,
  updateInAppMessageCategory,
} from '@/features/message/api/in-app-category';
import { Description } from '@/components/ui/description';
import { addDialog } from '@/components/ui/dialog';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import useBatchDeleteAction from '@/components/table/batch-delete-action';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/components/ui/overlay';
import { TREE_ROOT_PARENT_ID } from '@/shared/utils/tree';
import InAppCategoryFormDialog from '@/features/message/in-app-category/components/InAppCategoryFormDialog.vue';
import useInAppCategoryDetailColumns from '@/features/message/in-app-category/hooks/columns/use-in-app-category-detail-columns';
import type { Ref } from 'vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface InAppCategoryTableActionDeps {
  /** 新增/编辑/启停/删除成功后刷新树数据 */
  refresh: () => Promise<void>;
  /** 表格多选主键（工具栏批量删除用） */
  selectedRows: Ref<string[]>;
}

/**
 * 站内信业务分类表格/树操作
 * @param deps 操作依赖
 * @returns 操作方法
 */
function useInAppCategoryTableAction(deps: InAppCategoryTableActionDeps) {
  const { t } = useI18n();
  const { refresh, selectedRows } = deps;
  const { createFormBeforeSure } = useFormOverlaySubmit();
  const { detailColumns } = useInAppCategoryDetailColumns();

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: batchDeleteInAppMessageCategories,
    onSuccess: refresh,
  });

  /**
   * 打开新增弹窗
   * @param parentRow 传入大类时预填为小类父级；小类不可再挂子级
   */
  const openCreateDialog = (parentRow?: InAppMessageCategoryPageRow) => {
    // 仅大类可作父级；小类直接拒绝
    if (parentRow && parentRow.parentId !== TREE_ROOT_PARENT_ID) {
      return;
    }

    const dialogFormRef = ref<FormOverlayExpose<InAppMessageCategoryFormModel> | null>(null);

    addDialog({
      title: t('inAppCategory.dialog.create'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => (
        <InAppCategoryFormDialog
          ref={dialogFormRef}
          form={parentRow ? ({ parentId: parentRow.id } as InAppMessageCategoryFormModel) : undefined}
        />
      ),
      beforeSure: createFormBeforeSure<InAppMessageCategoryFormModel>({
        formExposeRef: dialogFormRef,
        successI18nKey: 'tips.addSuccess',
        onSubmit: async (formPayload) => {
          await createInAppMessageCategory(formPayload);
          await refresh();
        },
      }),
    });
  };

  /**
   * 打开编辑弹窗（先拉详情再回填；大类 parentId=0 视为未选）
   * @param row 表格行或树节点
   */
  const openEditDialog = async (row: InAppMessageCategoryPageRow) => {
    const dialogFormRef = ref<FormOverlayExpose<InAppMessageCategoryFormModel> | null>(null);

    try {
      const detail = await getInAppMessageCategoryById(row.id);
      const parentId = detail.parentId;
      const editForm = {
        ...detail,
        parentId: parentId === TREE_ROOT_PARENT_ID ? undefined : parentId,
      };

      addDialog({
        title: t('inAppCategory.dialog.edit'),
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        contentRenderer: () => <InAppCategoryFormDialog ref={dialogFormRef} form={editForm} />,
        beforeSure: createFormBeforeSure<InAppMessageCategoryFormModel>({
          formExposeRef: dialogFormRef,
          successI18nKey: 'tips.editSuccess',
          requireId: true,
          onSubmit: async (formPayload) => {
            await updateInAppMessageCategory(formPayload);
            await refresh();
          },
        }),
      });
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  /**
   * 打开详情弹窗
   * @param row 表格行或树节点
   */
  const openDetailDialog = async (row: InAppMessageCategoryPageRow) => {
    try {
      const detailData = await getInAppMessageCategoryById(row.id);
      addDialog({
        title: t('inAppCategory.dialog.view'),
        draggable: true,
        fullscreenIcon: true,
        hideFooter: true,
        contentRenderer: () => <Description column={2} columns={detailColumns.value} data={detailData ?? {}} />,
      });
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  /**
   * 批量启用或停用
   * @param ids 分类主键列表
   * @param enabled 是否启用
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
      await batchUpdateInAppMessageCategoryStatus({ ids, status: enabled });
      message(t('tips.editSuccess'), { type: 'success' });
      await refresh();
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  return {
    openCreateDialog,
    openEditDialog,
    openDetailDialog,
    batchUpdateStatus,
    deleteBatchRows,
  };
}

export default useInAppCategoryTableAction;
