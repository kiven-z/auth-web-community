import type { SysRolePageRow } from '@/features/system/api/role/role';
import { assignRolePermissions, getRolePermissions } from '@/features/system/api/role/role-permission';
import { type SysDataScopeForm, replaceRoleScope } from '@/features/system/api/role/role-scope';
import { openAssignDrawer } from '@/features/system/_shared/components/open-assign-drawer';
import { addDialog } from '@/components/ui/dialog';
import { addDrawer } from '@/components/ui/drawer';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/components/ui/overlay';
import PermissionAssignPanel from '@/features/system/role/components/PermissionAssignPanel.vue';
import RoleDataScopeDialog from '@/features/system/role/components/RoleDataScopeDialog.vue';
import RoleGrantSubjectsAssignDrawer from '@/features/system/role/components/grant-subjects/RoleGrantSubjectsAssignDrawer.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 角色表格「更多」操作：分配权限、数据范围、授权对象等
 * @returns 更多操作方法
 */
function useRoleMoreAction() {
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();

  /**
   * 打开分配权限抽屉
   * @param row 表格行
   */
  const openAssignPermissionDrawer = (row: SysRolePageRow) => {
    const loadAssigned = async () => {
      const rows = await getRolePermissions(row.id);
      return rows.map((permissionRow) => ({
        key: permissionRow.id,
        label: permissionRow.permissionName,
      }));
    };

    const selectedKeys = ref<string[]>([]);

    openAssignDrawer({
      title: t('roles.assign.permission'),
      selectedKeys,
      contentRenderer: () => (
        <PermissionAssignPanel
          modelValue={selectedKeys.value}
          onUpdate:modelValue={(value: string[]) => {
            selectedKeys.value = value;
          }}
          leftTitle={t('roles.assign.current')}
          leftSubtitle={`${row.roleName} (${row.roleCode})`}
          loadAssigned={loadAssigned}
          tableTitle={t('roles.assign.permission')}
        />
      ),
      onSubmit: (permissionIds) => assignRolePermissions(row.id, { permissionIds }),
    });
  };

  /**
   * 打开数据范围配置弹窗
   * @param row 表格行
   */
  const openDataScopeDialog = (row: SysRolePageRow) => {
    const dialogFormRef = ref<FormOverlayExpose<SysDataScopeForm[]> | null>(null);

    addDialog({
      title: `${t('roles.menu.dataScope')} - ${row.roleName} (${row.roleCode})`,
      draggable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => <RoleDataScopeDialog ref={dialogFormRef} roleId={row.id} />,
      beforeSure: createFormBeforeSure<SysDataScopeForm[]>({
        formExposeRef: dialogFormRef,
        successI18nKey: 'tips.editSuccess',
        onSubmit: (scopes) => replaceRoleScope(row.id, scopes),
      }),
    });
  };

  /**
   * 打开授权对象维护抽屉（按主体类型各自覆盖保存）
   * @param row 表格行
   */
  const openGrantSubjectsDrawer = (row: SysRolePageRow) => {
    addDrawer({
      title: `${t('roles.menu.grantSubjects')} - ${row.roleName} (${row.roleCode})`,
      size: '100%',
      resizable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showClose: true,
      hideFooter: true,
      contentRenderer: () => (
        <RoleGrantSubjectsAssignDrawer
          leftTitle={t('roles.assign.current')}
          leftSubtitle={`${row.roleName} (${row.roleCode})`}
          roleId={row.id}
        />
      ),
    });
  };

  return {
    openAssignPermissionDrawer,
    openDataScopeDialog,
    openGrantSubjectsDrawer,
  };
}

export default useRoleMoreAction;
