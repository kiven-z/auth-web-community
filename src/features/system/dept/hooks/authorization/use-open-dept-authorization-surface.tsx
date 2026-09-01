import { addDrawer } from '@/components/ui/drawer';
import DeptAuthorizationSurfaceDrawer from '@/features/system/dept/components/authorization/DeptAuthorizationSurfaceDrawer.vue';
import { useI18n } from 'vue-i18n';

/** 打开部门授权面抽屉入参 */
export interface OpenDeptAuthorizationSurfaceOptions {
  deptId: string;
  /** 展示用部门编码 */
  deptCode?: string | null;
  /** 展示用部门名称 */
  deptName?: string | null;
}

/**
 * 打开部门授权面抽屉（用户 / 岗位 / 角色分页查询）
 * @returns 打开方法
 */
function useOpenDeptAuthorizationSurface() {
  const { t } = useI18n();

  /**
   * 打开指定部门的授权面
   * @param options 部门标识与展示名
   */
  function openDeptAuthorizationSurface(options: OpenDeptAuthorizationSurfaceOptions) {
    const namePart = options.deptName ?? '';
    const codePart = options.deptCode ? ` (${options.deptCode})` : '';
    const titleSuffix = namePart || codePart ? ` · ${namePart}${codePart}` : '';
    addDrawer({
      title: `${t('dept.authorizationSurface.title')}${titleSuffix}`,
      size: '80%',
      resizable: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: () => <DeptAuthorizationSurfaceDrawer deptId={options.deptId} />,
    });
  }

  return { openDeptAuthorizationSurface };
}

export default useOpenDeptAuthorizationSurface;
