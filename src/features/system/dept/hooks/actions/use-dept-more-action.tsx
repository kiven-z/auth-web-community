import { getDeptRoles, putDeptRoles } from '@/features/system/api/dept/dept-role';
import { openAssignDrawer } from '@/features/system/_shared/components/open-assign-drawer';
import RoleAssignPanel from '@/features/system/_shared/components/RoleAssignPanel.vue';
import useOpenDeptAuthorizationSurface from '@/features/system/dept/hooks/authorization/use-open-dept-authorization-surface';
import type { SysDeptRow } from '@/features/system/dept/hooks/use-dept-page-state';
import type { TableActionDeps } from '@/shared/types/table-action';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

/** 部门「更多」操作依赖 */
export interface DeptMoreActionDeps extends TableActionDeps {
  refresh: () => Promise<void>;
}

/**
 * 部门「更多」操作（授权面、分配角色）
 * @param deps 操作依赖
 * @returns 更多操作方法
 */
function useDeptMoreAction(deps: DeptMoreActionDeps) {
  const { refresh } = deps;
  const { t } = useI18n();
  const { openDeptAuthorizationSurface } = useOpenDeptAuthorizationSurface();

  /**
   * 打开分配角色抽屉
   * @param row 部门行
   */
  const openAssignRoleDrawer = (row: SysDeptRow) => {
    const loadAssigned = async () => {
      const rows = await getDeptRoles(row.id);
      return rows.map((roleRow) => ({
        key: roleRow.id,
        label: roleRow.roleName,
      }));
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
          leftTitle={t('dept.assignRole.currentDept')}
          leftSubtitle={`${row.deptName}（${row.deptCode}）`}
          loadAssigned={loadAssigned}
        />
      ),
      onSubmit: (roleIds) => putDeptRoles(row.id, { roleIds }),
      afterSave: refresh,
    });
  };

  return {
    openDeptAuthorizationSurface,
    openAssignRoleDrawer,
  };
}

export default useDeptMoreAction;
