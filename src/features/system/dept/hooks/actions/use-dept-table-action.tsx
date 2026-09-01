import type { TableActionDeps } from '@/shared/types/table-action';
import {
  batchUpdateDeptStatus,
  createDept,
  deleteDepts,
  getDeptDetail,
  getDeptList,
  type SysDeptCreateForm,
  type SysDeptListVO,
  type SysDeptUpdateForm,
  updateDept,
} from '@/features/system/api/dept/dept';
import { addDialog } from '@/components/ui/dialog';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import useBatchDeleteAction from '@/components/table/batch-delete-action';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/components/ui/overlay';
import { TREE_ROOT_PARENT_ID } from '@/shared/utils/tree';
import DeptDescriptionDialog from '@/features/system/dept/components/detail/DeptDescriptionDialog.vue';
import DeptFormDialog from '@/features/system/dept/components/form/DeptFormDialog.vue';
import type { DeptViewMode, SysDeptRow } from '@/features/system/dept/hooks/use-dept-page-state';
import type { Ref } from 'vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export interface DeptTableActionDeps extends TableActionDeps {
  refresh: () => Promise<void>;
  viewMode: Ref<DeptViewMode>;
  selectedRows: Ref<string[]>;
}

/**
 * 部门行操作：详情、新增、删除等
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function useDeptTableAction(deps: DeptTableActionDeps) {
  const { t } = useI18n();
  const { refresh } = deps;
  const { createFormBeforeSure } = useFormOverlaySubmit();

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows: deps.selectedRows,
    deleteApi: deleteDepts,
    onSuccess: refresh,
  });

  /**
   * 解析父部门展示名
   */
  const resolveParentDeptLabel = (detailParentId: string, flatList: SysDeptListVO[]): string => {
    if (!detailParentId || detailParentId === TREE_ROOT_PARENT_ID) {
      return t('dept.field.parentTopLevel');
    }
    const parent = flatList.find((item) => item.id === detailParentId);
    return parent?.deptName ?? detailParentId;
  };

  /**
   * 打开详情弹窗
   * @param row 表格行或树节点数据
   */
  const openDetailDialog = async (row: SysDeptRow) => {
    try {
      const [detail, flatList] = await Promise.all([getDeptDetail(row.id), getDeptList()]);
      const parentDeptLabel = resolveParentDeptLabel(detail.parentId, flatList);

      addDialog({
        title: t('dept.dialog.view'),
        draggable: true,
        fullscreenIcon: true,
        hideFooter: true,
        contentRenderer: () => h(DeptDescriptionDialog, { data: detail, parentDeptLabel }),
      });
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  /**
   * 打开新增弹窗
   * @param parentRow 树视图「新增下级」时传入，预填父部门
   */
  const openCreateDialog = (parentRow?: SysDeptRow) => {
    const dialogFormRef = ref<FormOverlayExpose<SysDeptCreateForm> | null>(null);

    addDialog({
      title: t('dept.dialog.create'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () =>
        h(DeptFormDialog, {
          ref: dialogFormRef,
          form: parentRow ? ({ parentId: parentRow.id } as SysDeptCreateForm) : undefined,
        }),
      beforeSure: createFormBeforeSure<SysDeptCreateForm>({
        formExposeRef: dialogFormRef,
        successI18nKey: 'tips.addSuccess',
        onSubmit: async (formPayload) => {
          await createDept(formPayload);
          await refresh();
        },
      }),
    });
  };

  /**
   * 打开编辑弹窗（顶级 parentId=0 视为未选）
   * @param row 表格行或树节点
   */
  const openEditDialog = async (row: SysDeptRow) => {
    try {
      const detail = await getDeptDetail(row.id);
      const parentId = detail.parentId;
      const editForm = {
        ...detail,
        parentId: parentId === TREE_ROOT_PARENT_ID ? undefined : parentId,
      };
      const dialogFormRef = ref<FormOverlayExpose<SysDeptUpdateForm> | null>(null);

      addDialog({
        title: t('dept.dialog.edit'),
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        contentRenderer: () => h(DeptFormDialog, { ref: dialogFormRef, form: editForm }),
        beforeSure: createFormBeforeSure<SysDeptUpdateForm>({
          formExposeRef: dialogFormRef,
          requireId: true,
          successI18nKey: 'tips.editSuccess',
          onSubmit: async (formData) => {
            await updateDept(formData);
            await refresh();
          },
        }),
      });
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
      await batchUpdateDeptStatus({ ids, status });
      message(t('tips.editSuccess'), { type: 'success' });
      await refresh();
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  return {
    openCreateDialog,
    openDetailDialog,
    openEditDialog,
    deleteBatchRows,
    batchUpdateStatus,
  };
}

export default useDeptTableAction;
