import { addDrawer } from '@/components/ui/Drawer';
import RoleAuthorizationSurfaceDrawer from '@/features/system/role/components/authorization/RoleAuthorizationSurfaceDrawer.vue';
import { useI18n } from 'vue-i18n';

/** 打开角色授权面抽屉入参 */
export interface OpenRoleAuthorizationSurfaceOptions {
  roleId: string;
  roleCode: string;
  roleName: string;
}

/**
 * 打开角色授权面抽屉（权限 / 菜单分页查询）
 * @returns 打开方法
 */
function useOpenRoleAuthorizationSurface() {
  const { t } = useI18n();

  /**
   * 打开指定角色的授权面
   * @param options 角色标识与展示名
   */
  function openRoleAuthorizationSurface(options: OpenRoleAuthorizationSurfaceOptions) {
    addDrawer({
      title: `${t('roles.authorizationSurface.title')} · ${options.roleName} (${options.roleCode})`,
      size: '80%',
      resizable: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: () => <RoleAuthorizationSurfaceDrawer roleId={options.roleId} />,
    });
  }

  return { openRoleAuthorizationSurface };
}

export default useOpenRoleAuthorizationSurface;
