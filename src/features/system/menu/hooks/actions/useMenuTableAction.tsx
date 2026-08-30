import useBatchDeleteAction from '@/components/table/BatchDeleteAction';
import { addDialog } from '@/components/ui/Dialog';
import { addDrawer } from '@/components/ui/Drawer';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/components/ui/Overlay';
import {
  createMenu,
  deleteMenus,
  getMenuDetail,
  type MenuCreateForm,
  type MenuUpdateForm,
  updateMenu,
  updateMenuBatchStatus,
} from '@/features/system/api/menu/menu';
import MenuDescriptionDialog from '@/features/system/menu/components/detail/MenuDescriptionDialog.vue';
import MenuDialog from '@/features/system/menu/components/form/MenuDialog.vue';
import type { MenuViewMode, SysMenuRow } from '@/features/system/menu/hooks/useMenuPageState';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import type { TableActionDeps } from '@/shared/types/tableAction';
import type { Ref } from 'vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/** 菜单表格操作依赖 */
interface MenuTableActionDeps extends TableActionDeps {
  refresh: () => Promise<void>;
  viewMode: Ref<MenuViewMode>;
  selectedRows: Ref<string[]>;
}

/**
 * 菜单表格操作
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function useMenuTableAction(deps: MenuTableActionDeps) {
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();
  const { refresh } = deps;
  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows: deps.selectedRows,
    deleteApi: deleteMenus,
    onSuccess: refresh,
  });

  /**
   * 打开创建抽屉
   * @param parentRow 树视图「新增下级」时传入，预填父菜单
   */
  const openCreateDialog = (parentRow?: SysMenuRow) => {
    const drawerFormRef = ref<FormOverlayExpose<MenuCreateForm> | null>(null);

    addDrawer({
      title: t('sysMenu.addDialogTitle'),
      size: '80%',
      resizable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showClose: true,
      contentRenderer: () =>
        h(MenuDialog, {
          ref: drawerFormRef,
          form: parentRow ? { parentId: parentRow.id } : {},
          isFormDisabled: false,
        }),
      beforeSure: createFormBeforeSure<MenuCreateForm>({
        formExposeRef: drawerFormRef,
        successI18nKey: 'tips.addSuccess',
        onSubmit: async (formPayload) => {
          await createMenu(formPayload);
          await refresh();
        },
      }),
    });
  };

  /**
   * 打开编辑抽屉
   * @param row 行数据
   */
  const openEditDialog = async (row: SysMenuRow) => {
    try {
      const detail = await getMenuDetail(row.id);
      const drawerFormRef = ref<FormOverlayExpose<MenuUpdateForm> | null>(null);

      addDrawer({
        title: t('sysMenu.editDialogTitle'),
        size: '80%',
        resizable: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        showClose: true,
        contentRenderer: () =>
          h(MenuDialog, {
            ref: drawerFormRef,
            form: detail,
            isFormDisabled: false,
          }),
        beforeSure: createFormBeforeSure<MenuUpdateForm>({
          formExposeRef: drawerFormRef,
          successI18nKey: 'tips.editSuccess',
          requireId: true,
          onSubmit: async (formPayload) => {
            await updateMenu(formPayload);
            await refresh();
          },
        }),
      });
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  /**
   * 打开详情对话框
   * @param row 行数据
   */
  const openDetailDialog = async (row: SysMenuRow) => {
    try {
      const detail = await getMenuDetail(row.id);

      addDialog({
        title: t('sysMenu.bindingDialogTitle'),
        draggable: true,
        fullscreenIcon: true,
        hideFooter: true,
        contentRenderer: () => h(MenuDescriptionDialog, { data: detail }),
      });
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  /**
   * 批量更新状态
   * @param ids 行ID列表
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
      await updateMenuBatchStatus({ ids, status: enabled });
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
    deleteBatchRows,
    batchUpdateStatus,
  };
}

export default useMenuTableAction;
