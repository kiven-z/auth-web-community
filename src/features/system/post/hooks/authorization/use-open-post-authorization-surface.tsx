import { addDrawer } from '@/components/ui/drawer';
import PostAuthorizationSurfaceDrawer from '@/features/system/post/components/authorization/PostAuthorizationSurfaceDrawer.vue';
import { useI18n } from 'vue-i18n';

/** 打开岗位授权面抽屉入参 */
export interface OpenPostAuthorizationSurfaceOptions {
  postId: string;
  /** 展示用岗位编码 */
  postCode?: string | null;
  /** 展示用岗位名称 */
  postName?: string | null;
}

/**
 * 打开岗位授权面抽屉（用户 / 角色分页查询）
 * @returns 打开方法
 */
function useOpenPostAuthorizationSurface() {
  const { t } = useI18n();

  /**
   * 打开指定岗位的授权面
   * @param options 岗位标识与展示名
   */
  function openPostAuthorizationSurface(options: OpenPostAuthorizationSurfaceOptions) {
    const namePart = options.postName ?? '';
    const codePart = options.postCode ? ` (${options.postCode})` : '';
    const titleSuffix = namePart || codePart ? ` · ${namePart}${codePart}` : '';
    addDrawer({
      title: `${t('post.authorizationSurface.title')}${titleSuffix}`,
      size: '80%',
      resizable: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: () => <PostAuthorizationSurfaceDrawer postId={options.postId} />,
    });
  }

  return { openPostAuthorizationSurface };
}

export default useOpenPostAuthorizationSurface;
