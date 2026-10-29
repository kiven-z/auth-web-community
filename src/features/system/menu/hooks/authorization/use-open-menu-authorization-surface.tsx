import { addDrawer } from '@/components/ui/drawer';
import { getMenuRolesPage } from '@/features/system/api/menu/menu-authorization';
import SubjectBoundRolesPanel from '@/features/system/_shared/components/SubjectBoundRolesPanel.vue';
import { SYS_MENU_PERMS } from '@/features/system/menu/constants/permissions';
import { useI18n } from 'vue-i18n';

/** 打开菜单授权面抽屉入参 */
export interface OpenMenuAuthorizationSurfaceOptions {
  menuId: string;
  /** 展示用路由名称 */
  name?: string | null;
  /** 展示用菜单标题（已翻译） */
  title?: string | null;
}

/**
 * 打开菜单授权面抽屉（绑定角色分页查询）
 * @returns 打开方法
 */
function useOpenMenuAuthorizationSurface() {
  const { t } = useI18n();

  /**
   * 打开指定菜单的授权面
   * @param options 菜单标识与展示名
   */
  function openMenuAuthorizationSurface(options: OpenMenuAuthorizationSurfaceOptions) {
    const namePart = options.title ?? '';
    const codePart = options.name ? ` (${options.name})` : '';
    const titleSuffix = namePart || codePart ? ` · ${namePart}${codePart}` : '';
    addDrawer({
      title: `${t('sysMenu.authorizationSurface.title')}${titleSuffix}`,
      size: '80%',
      resizable: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: () => (
        <SubjectBoundRolesPanel
          fetchPage={(query) => getMenuRolesPage(options.menuId, query)}
          queryPerm={SYS_MENU_PERMS.QUERY}
          title={t('sysMenu.bound.roles.title')}
        />
      ),
    });
  }

  return { openMenuAuthorizationSurface };
}

export default useOpenMenuAuthorizationSurface;
