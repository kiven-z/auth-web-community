import type { CSSProperties } from 'vue';

/** mix 顶栏菜单标题行布局 */
export const MENU_TITLE_ROW_STYLE: CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  overflow: 'hidden',
};

const HTTP_URL = /^http(s?):\/\//;

/**
 * mix 布局：取一级菜单可导航 index（首子路径；外链则拼父 path）
 * @param route 菜单路由节点
 * @returns el-menu index，配置异常时返回 undefined
 */
export function resolveMixMenuIndexPath(route: {
  path?: string;
  children?: Array<{ path?: string }>;
}): string | undefined {
  if (!route.children?.length) {
    console.error('The current routing configuration is incorrect, please check the configuration');
    return undefined;
  }
  const childPath = route.children[0]?.path ?? '';
  if (HTTP_URL.test(childPath)) {
    return `${route.path}/${childPath}`;
  }
  return childPath;
}
