import { addDrawer } from '@/components/ui/drawer';
import { getPermissionRolesPage } from '@/features/system/api/permission/permission-authorization';
import SubjectBoundRolesPanel from '@/features/system/_shared/components/SubjectBoundRolesPanel.vue';
import { SYS_PERMISSION_PERMS } from '@/features/system/permission/constants/permissions';
import { useI18n } from 'vue-i18n';

/** 打开权限授权面抽屉入参 */
export interface OpenPermissionAuthorizationSurfaceOptions {
  permissionId: string;
  /** 展示用权限编码 */
  permissionCode?: string | null;
  /** 展示用权限名称 */
  permissionName?: string | null;
}

/**
 * 打开权限授权面抽屉（绑定角色分页查询）
 * @returns 打开方法
 */
function useOpenPermissionAuthorizationSurface() {
  const { t } = useI18n();

  /**
   * 打开指定权限的授权面
   * @param options 权限标识与展示名
   */
  function openPermissionAuthorizationSurface(options: OpenPermissionAuthorizationSurfaceOptions) {
    const namePart = options.permissionName ?? '';
    const codePart = options.permissionCode ? ` (${options.permissionCode})` : '';
    const titleSuffix = namePart || codePart ? ` · ${namePart}${codePart}` : '';

    addDrawer({
      title: `${t('permissions.authorizationSurface.title')}${titleSuffix}`,
      size: '80%',
      resizable: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: () => (
        <SubjectBoundRolesPanel
          fetchPage={(query) => getPermissionRolesPage(options.permissionId, query)}
          queryPerm={SYS_PERMISSION_PERMS.QUERY}
          title={t('permissions.bound.roles.title')}
        />
      ),
    });
  }

  return { openPermissionAuthorizationSurface };
}

export default useOpenPermissionAuthorizationSurface;
