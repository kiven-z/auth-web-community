import type { FunctionalComponent } from 'vue';

const { VITE_HIDE_HOME } = import.meta.env;

export const routerArrays: Array<RouteConfigs> =
  VITE_HIDE_HOME === 'false'
    ? [
        {
          path: '/welcome',
          name: 'Welcome',
          meta: {
            title: 'menus.home',
            icon: 'ep/home-filled',
          },
        },
      ]
    : [];

/** 路由 meta 扩展字段 */
export interface RouteMeta {
  title?: string;
  icon?: string | FunctionalComponent;
  showLink?: boolean;
  savedPosition?: boolean;
}

/** 路由配置（菜单 / 标签页） */
export interface RouteConfigs {
  path?: string;
  query?: object;
  params?: object;
  meta?: RouteMeta;
  children?: RouteConfigs[];
  name?: string;
}

/** 标签页右键 / 下拉菜单项 */
export interface TagContextMenuItem {
  icon: string | FunctionalComponent;
  text: string;
  divided: boolean;
  disabled: boolean;
  show: boolean;
}

/** 侧边栏菜单节点 */
export interface SidebarMenuNode {
  id?: number;
  name?: string;
  path?: string;
  noShowingChildren?: boolean;
  children?: SidebarMenuNode[];
  value: unknown;
  meta?: {
    icon?: string;
    title?: string;
    rank?: number;
    showParent?: boolean;
    extraIcon?: string;
  };
  showTooltip?: boolean;
  parentId?: number;
  pathList?: number[];
  redirect?: string;
}

/** 侧栏主题色板项 */
export interface NavThemeColorItem {
  color: string;
  navTheme: string;
}
