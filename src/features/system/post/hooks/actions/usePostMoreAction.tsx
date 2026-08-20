import useOpenPostAuthorizationSurface from '@/features/system/post/hooks/authorization/useOpenPostAuthorizationSurface';

/**
 * 岗位「更多」操作（授权面）
 * @returns 更多操作方法
 */
function usePostMoreAction() {
  const { openPostAuthorizationSurface } = useOpenPostAuthorizationSurface();

  return {
    openPostAuthorizationSurface,
  };
}

export default usePostMoreAction;
