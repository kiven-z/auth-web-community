import type { TableActionDeps } from '@/shared/types/table-action';
import type { SysRoleCreateForm, SysRolePageRow, SysRoleUpdateForm } from '@/features/system/api/role/role';
import {
  batchUpdateRoleStatus,
  createRole,
  deleteRole,
  getRoleDetail,
  updateRole,
} from '@/features/system/api/role/role';
import { addDialog } from '@/components/ui/dialog';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/components/ui/overlay';
import { deleteConfirm, operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import RoleDescriptionDialog from '@/features/system/role/components/RoleDescriptionDialog.vue';
import RoleFormDialog from '@/features/system/role/components/RoleFormDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 角色表格操作：弹窗与写接口
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function useRoleTableAction(deps: TableActionDeps) {
  const { fetchTableData } = deps;
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();

  /**
   * 打开新增弹窗
   */
  const openCreateDialog = () => {
    const dialogFormRef = ref<FormOverlayExpose<SysRoleCreateForm> | null>(null);

    addDialog({
      title: t('roles.title.create'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(RoleFormDialog, { ref: dialogFormRef }),
      beforeSure: createFormBeforeSure<SysRoleCreateForm>({
        formExposeRef: dialogFormRef,
        successI18nKey: 'tips.addSuccess',
        onSubmit: async (formPayload) => {
          await createRole(formPayload);
          await fetchTableData();
        },
      }),
    });
  };

  /**
   * 查看详情
   * @param row 表格行
   */
  const openDetailDialog = async (row: SysRolePageRow) => {
    try {
      const detail = await getRoleDetail(row.id);
      addDialog({
        title: t('roles.title.view'),
        draggable: true,
        fullscreenIcon: true,
        hideFooter: true,
        contentRenderer: () => h(RoleDescriptionDialog, { data: detail }),
      });
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  /**
   * 打开编辑弹窗
   * @param row 表格行
   */
  const openEditDialog = async (row: SysRolePageRow) => {
    const detail = await getRoleDetail(row.id);
    const dialogFormRef = ref<FormOverlayExpose<SysRoleUpdateForm> | null>(null);

    addDialog({
      title: t('roles.title.edit'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(RoleFormDialog, { ref: dialogFormRef, form: { ...detail, id: row.id } }),
      beforeSure: createFormBeforeSure<SysRoleUpdateForm>({
        formExposeRef: dialogFormRef,
        requireId: true,
        successI18nKey: 'tips.editSuccess',
        onSubmit: async (formData) => {
          await updateRole(formData);
          await fetchTableData();
        },
      }),
    });
  };

  /**
   * 单行删除
   * @param row 表格行
   */
  const deleteRow = async (row: SysRolePageRow) => {
    const confirmed = await deleteConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await deleteRole(row.id);
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
      await batchUpdateRoleStatus({ ids, status });
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

export default useRoleTableAction;
