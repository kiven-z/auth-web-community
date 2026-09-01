import {
  batchDeleteUserDepts,
  clearUserDepts,
  createUserDept,
  updateUserDept,
  type UserDeptAssignForm,
  type UserDeptPageRow,
} from '@/features/system/api/user/user-dept';
import { addDialog } from '@/components/ui/dialog';
import useBatchDeleteAction from '@/components/table/batch-delete-action';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/components/ui/overlay';
import { errorMessage, message } from '@/services/feedback/message';
import { multiConfirm } from '@/services/feedback/dialog';
import UserDeptAssignFormDialog from '@/features/system/user/workstation/panels/assign/dept/UserDeptAssignFormDialog.vue';
import { ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { TableActionDeps } from '@/shared/types/table-action';

/** 用户工作台「分配部门」面板操作依赖 */
interface GrantDeptActionDeps extends TableActionDeps {
  /** 用户主键 */
  userId: string;
  /** 表格多选主键 */
  selectedRows: Ref<string[]>;
}

/**
 * 用户工作台分配部门：新增、编辑、批量删除、清空
 * @param deps 面板操作依赖
 * @returns 面板操作方法
 */
function useGrantDeptAction(deps: GrantDeptActionDeps) {
  const { userId, fetchTableData, selectedRows } = deps;
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: (ids) => batchDeleteUserDepts(userId, ids),
    onSuccess: fetchTableData,
  });

  /**
   * 打开编辑部门关联弹窗
   * @param row 表格行
   */
  const openEditDialog = (row: UserDeptPageRow) => {
    const dialogFormRef = ref<FormOverlayExpose<UserDeptAssignForm> | null>(null);

    addDialog({
      title: t('users.deptAssign.editTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => (
        <UserDeptAssignFormDialog
          ref={dialogFormRef}
          form={{
            deptId: row.deptId,
            isPrimary: row.isPrimary,
            remark: row.remark ?? undefined,
          }}
        />
      ),
      beforeSure: createFormBeforeSure<UserDeptAssignForm>({
        formExposeRef: dialogFormRef,
        successI18nKey: 'tips.editSuccess',
        onSubmit: async (formPayload) => {
          await updateUserDept(userId, row.id, formPayload);
          await fetchTableData();
        },
      }),
    });
  };

  /**
   * 打开新增部门关联弹窗
   */
  const openCreateDialog = () => {
    const dialogFormRef = ref<FormOverlayExpose<UserDeptAssignForm> | null>(null);

    addDialog({
      title: t('users.deptAssign.createTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => <UserDeptAssignFormDialog ref={dialogFormRef} />,
      beforeSure: createFormBeforeSure<UserDeptAssignForm>({
        formExposeRef: dialogFormRef,
        successI18nKey: 'tips.addSuccess',
        onSubmit: async (formPayload) => {
          await createUserDept(userId, formPayload);
          await fetchTableData();
        },
      }),
    });
  };

  /**
   * 清空当前用户全部部门关联
   */
  const clearAllDepts = async () => {
    const confirmed = await multiConfirm([
      {
        title: t('users.deptAssign.clearAllConfirm'),
        message: t('users.deptAssign.clearAllConfirm'),
      },
    ]);
    if (!confirmed) {
      return;
    }

    try {
      await clearUserDepts(userId);
      message(t('tips.deleteSuccess'), { type: 'success' });
      selectedRows.value = [];
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  return {
    openCreateDialog,
    openEditDialog,
    deleteBatchRows,
    clearAllDepts,
  };
}

export default useGrantDeptAction;
