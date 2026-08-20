import {
  batchDeleteUserPosts,
  clearUserPosts,
  createUserPost,
  updateUserPost,
  type UserPostAssignForm,
  type UserPostPageRow,
  type UserPostRelationUpdateForm,
} from '@/features/system/api/user/user-post';
import type { TableActionDeps } from '@/shared/types/table-action';
import { addDialog } from '@/components/ui/Dialog';
import useBatchDeleteAction from '@/components/table/BatchDeleteAction';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/components/ui/Overlay';
import { errorMessage, message } from '@/services/feedback/message';
import { multiConfirm } from '@/services/feedback/dialog';
import UserPostAssignFormDialog from '@/features/system/user/workstation/panels/assign/post/UserPostAssignFormDialog.vue';
import { ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

/** 用户工作台「分配岗位」面板操作依赖 */
interface GrantPostActionDeps extends TableActionDeps {
  /** 用户主键 */
  userId: string;
  /** 表格多选主键 */
  selectedRows: Ref<string[]>;
}

/**
 * 用户工作台分配岗位：新增、编辑、批量删除、清空
 * @param deps 面板操作依赖
 * @returns 面板操作方法
 */
function useGrantPostAction(deps: GrantPostActionDeps) {
  const { userId, fetchTableData, selectedRows } = deps;
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: (ids) => batchDeleteUserPosts(userId, ids),
    onSuccess: fetchTableData,
  });

  /**
   * 打开编辑岗位关联弹窗
   * @param row 表格行
   */
  const openEditDialog = (row: UserPostPageRow) => {
    const dialogFormRef = ref<FormOverlayExpose<UserPostRelationUpdateForm> | null>(null);

    addDialog({
      title: t('users.postAssign.editTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => (
        <UserPostAssignFormDialog
          ref={dialogFormRef}
          editMode={true}
          form={{ isPrimary: row.isPrimary, remark: row.remark }}
        />
      ),
      beforeSure: createFormBeforeSure<UserPostRelationUpdateForm>({
        formExposeRef: dialogFormRef,
        successI18nKey: 'tips.editSuccess',
        onSubmit: async (formPayload) => {
          await updateUserPost(userId, row.id, formPayload);
          await fetchTableData();
        },
      }),
    });
  };

  /**
   * 打开新增岗位关联弹窗
   */
  const openCreateDialog = () => {
    const dialogFormRef = ref<FormOverlayExpose<UserPostAssignForm> | null>(null);

    addDialog({
      title: t('users.postAssign.createTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => <UserPostAssignFormDialog ref={dialogFormRef} />,
      beforeSure: createFormBeforeSure<UserPostAssignForm>({
        formExposeRef: dialogFormRef,
        successI18nKey: 'tips.addSuccess',
        onSubmit: async (formPayload) => {
          await createUserPost(userId, formPayload);
          await fetchTableData();
        },
      }),
    });
  };

  /**
   * 清空当前用户全部岗位关联
   */
  const clearAllPosts = async () => {
    const confirmed = await multiConfirm([
      {
        title: t('users.postAssign.clearAllConfirm'),
        message: t('users.postAssign.clearAllConfirm'),
      },
    ]);
    if (!confirmed) {
      return;
    }

    try {
      await clearUserPosts(userId);
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
    clearAllPosts,
  };
}

export default useGrantPostAction;
