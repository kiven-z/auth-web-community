/**
 * 授权失效幂等事件按钮权限码
 */
export const SYS_AUTH_INVALIDATION_EVENT_PERMS = {
  /** 分页查询 */
  QUERY: 'ops:invalidationevent:query',
  /** 事件详情 */
  DETAIL: 'ops:invalidationevent:detail',
  /** 释放 processing 占位 */
  RELEASE_CLAIM: 'ops:invalidationevent:releaseclaim',
} as const;
