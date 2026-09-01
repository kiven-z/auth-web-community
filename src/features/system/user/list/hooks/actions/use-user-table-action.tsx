import type { TableActionWithSelectionDeps } from '@/shared/types/table-action';
import { batchUpdateUserStatus, createUser, type SysUserCreateForm } from '@/features/system/api/user/user';
import { addDialog } from '@/components/ui/dialog';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/components/ui/overlay';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import UserCreateFormDialog from '@/features/system/user/list/components/UserCreateFormDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 用户表格写操作：新增、批量改状态
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function useUserTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();

  /**
   * 打开新增用户弹窗
   */
  const openCreateDialog = () => {
    const dialogFormRef = ref<FormOverlayExpose<SysUserCreateForm> | null>(null);

    addDialog({
      title: t('users.title.create'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(UserCreateFormDialog, { ref: dialogFormRef }),
      beforeSure: createFormBeforeSure<SysUserCreateForm>({
        formExposeRef: dialogFormRef,
        successI18nKey: 'tips.addSuccess',
        onSubmit: async (formPayload) => {
          await createUser(formPayload);
          await fetchTableData();
        },
      }),
    });
  };

  /**
   * 批量更新账号状态
   * @param ids 用户主键列表
   * @param status 目标状态码
   */
  const batchUpdateStatus = async (ids: string[], status: number) => {
    if (ids.length <= 0) {
      return;
    }

    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await batchUpdateUserStatus({ ids, status });
      message(t('tips.editSuccess'), { type: 'success' });
      selectedRows.value = [];
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  return {
    openCreateDialog,
    batchUpdateStatus,
  };
}

export default useUserTableAction;
