import useOpenDeptAuthorizationSurface from '@/features/system/dept/hooks/authorization/use-open-dept-authorization-surface';

/**
 * 部门「更多」操作（授权面）
 * @returns 更多操作方法
 */
function useDeptMoreAction() {
  const { openDeptAuthorizationSurface } = useOpenDeptAuthorizationSurface();

  return {
    openDeptAuthorizationSurface,
  };
}

export default useDeptMoreAction;
