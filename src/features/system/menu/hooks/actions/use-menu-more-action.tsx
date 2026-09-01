import { getMenuRoles, putMenuRoles } from '@/features/system/api/menu/menu-role';
import { transformI18n } from '@/app/plugins/i18n';
import { openAssignDrawer } from '@/features/system/_shared/components/open-assign-drawer';
import type { TableActionDeps } from '@/shared/types/table-action';
import RoleAssignPanel from '@/features/system/_shared/components/RoleAssignPanel.vue';
import useOpenMenuAuthorizationSurface from '@/features/system/menu/hooks/authorization/use-open-menu-authorization-surface';
import type { SysMenuRow } from '@/features/system/menu/hooks/use-menu-page-state';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

/** 菜单「更多」操作依赖 */
export interface MenuTableActionDeps extends TableActionDeps {
  refresh: () => Promise<void>;
}

/**
 * 菜单「更多」操作（授权面、分配角色）
 * @param deps 表格操作依赖
 * @returns 更多操作方法
 */
function useMenuMoreAction(deps: MenuTableActionDeps) {
  const { refresh } = deps;
  const { t } = useI18n();
  const { openMenuAuthorizationSurface } = useOpenMenuAuthorizationSurface();

  /**
   * 打开分配角色抽屉
   * @param row 行数据
   */
  const openAssignRoleDrawer = (row: SysMenuRow) => {
    const loadAssigned = async () => {
      const rows = await getMenuRoles(row.id);
      return rows.map((roleRow) => ({ key: roleRow.id, label: roleRow.roleName }));
    };

    const selectedKeys = ref<string[]>([]);

    openAssignDrawer({
      title: t('assign.role'),
      selectedKeys,
      contentRenderer: () => (
        <RoleAssignPanel
          modelValue={selectedKeys.value}
          onUpdate:modelValue={(value: string[]) => {
            selectedKeys.value = value;
          }}
          leftTitle={t('sysMenu.name')}
          leftSubtitle={`${transformI18n(row.title)} (${row.name})`}
          loadAssigned={loadAssigned}
        />
      ),
      onSubmit: async (roleIds) => {
        await putMenuRoles(row.id, { roleIds });
      },
      afterSave: refresh,
    });
  };

  return {
    openMenuAuthorizationSurface,
    openAssignRoleDrawer,
  };
}

export default useMenuMoreAction;
