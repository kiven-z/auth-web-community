import type { SysPostPageRow } from '@/features/system/api/post/post';
import { getPostRoles, putPostRoles } from '@/features/system/api/post/post-role';
import { openAssignDrawer } from '@/features/system/_shared/components/open-assign-drawer';
import RoleAssignPanel from '@/features/system/_shared/components/RoleAssignPanel.vue';
import useOpenPostAuthorizationSurface from '@/features/system/post/hooks/authorization/use-open-post-authorization-surface';
import type { TableActionDeps } from '@/shared/types/table-action';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

/** 岗位「更多」操作依赖 */
export type PostMoreActionDeps = TableActionDeps;

/**
 * 岗位「更多」操作（授权面、分配角色）
 * @param deps 操作依赖
 * @returns 更多操作方法
 */
function usePostMoreAction(deps: PostMoreActionDeps) {
  const { fetchTableData } = deps;
  const { t } = useI18n();
  const { openPostAuthorizationSurface } = useOpenPostAuthorizationSurface();

  /**
   * 打开分配角色抽屉
   * @param row 岗位行
   */
  const openAssignRoleDrawer = (row: SysPostPageRow) => {
    const loadAssigned = async () => {
      const rows = await getPostRoles(row.id);
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
          leftTitle={t('post.assign.current')}
          leftSubtitle={`${row.postName}（${row.postCode}）`}
          loadAssigned={loadAssigned}
        />
      ),
      onSubmit: (roleIds) => putPostRoles(row.id, { roleIds }),
      afterSave: fetchTableData,
    });
  };

  return {
    openPostAuthorizationSurface,
    openAssignRoleDrawer,
  };
}

export default usePostMoreAction;
