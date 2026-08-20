/**
 * 授权失效 Outbox 按钮权限码
 */
export const SYS_AUTH_INVALIDATION_OUTBOX_PERMS = {
  /** 分页查询、运维统计摘要 */
  QUERY: 'ops:invalidationoutbox:query',
  /** Outbox 详情 */
  DETAIL: 'ops:invalidationoutbox:detail',
  /** 人工重试投递 */
  RETRY: 'ops:invalidationoutbox:retry',
} as const;
