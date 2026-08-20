/** 会话数据（Pinia / 本地缓存读写） */
export interface DataInfo<T> {
  /** 访问令牌 */
  accessToken?: string;
  /** `accessToken` 过期时间（时间戳） */
  expires?: T;
  /** 用户 ID（Long 字符串化） */
  userId?: string;
  /** 头像 */
  avatar?: string;
  /** 用户名 */
  username?: string;
  /** 昵称 */
  nickname?: string;
  /** 主部门 ID（Long 字符串化） */
  primaryDeptId?: string;
  /** 主部门名称 */
  primaryDeptName?: string;
  /** 当前登录用户的角色 */
  roles?: Array<string>;
  /** 当前登录用户的按钮级别权限 */
  permissions?: Array<string>;
}

/**
 * 写入会话所需的鉴权字段（登录或刷新后均须携带完整授权快照）
 * nickname / avatar / 主部门仅由 profile hydrate 写入，不经本载荷
 */
export interface SessionTokenPayload {
  accessToken: string;
  expires?: string | number;
  username: string;
  roles: Array<string>;
  permissions: Array<string>;
  /** 用户 ID（Long 字符串化） */
  userId: string;
}

/** 用户资料快照（写入 localStorage 与同步 Pinia 时使用） */
export interface UserProfileSnapshot {
  avatar: string;
  username: string;
  nickname: string;
  /** 主部门 ID（Long 字符串化，无主部门时为空串） */
  primaryDeptId: string;
  /** 主部门名称（无主部门时为空串） */
  primaryDeptName: string;
  roles: Array<string>;
  permissions: Array<string>;
  userId: string;
}
