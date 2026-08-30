import type { RouteRecordName } from 'vue-router';

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

/** 多标签页路由项 */
export interface TagRouteItem {
  path: string;
  name: RouteRecordName;
  meta: any;
  query?: object;
  params?: object;
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
