import type { RouteRecordName } from 'vue-router';
import type { LayoutMode } from '@/shared/utils/layout/layout-mode';

/** KeepAlive 缓存页操作参数 */
export interface KeepAliveCacheOp {
  mode: string;
  name?: RouteRecordName;
}

/** 标签页 splice 位置 */
export interface TagSplicePosition {
  startIndex?: number;
  length?: number;
}

/** 应用布局状态 */
export interface AppLayoutState {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
    /** 是否由用户手动点击折叠侧边栏 */
    isClickCollapse: boolean;
  };
  layout: LayoutMode;
  device: string;
  viewportSize: { width: number; height: number };
}

/** 多标签页路由项 */
export interface TagRouteItem {
  path: string;
  name: RouteRecordName;
  meta: any;
  query?: object;
  params?: object;
}

/** 系统设置项 */
export interface AppSettingsState {
  title: string;
  fixedHeader: boolean;
  hiddenSideBar: boolean;
}

/** 当前登录用户状态 */
export interface AuthUserState {
  avatar?: string;
  username?: string;
  nickname?: string;
  /** 主部门 ID（Long 字符串化） */
  primaryDeptId?: string;
  /** 主部门名称 */
  primaryDeptName?: string;
  /** 用户 ID（Long 字符串化） */
  userId?: string;
  roles?: Array<string>;
  permissions?: Array<string>;
  isRemembered?: boolean;
  loginDay?: number;
}
