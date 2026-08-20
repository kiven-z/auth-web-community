/**
 * 站内信业务分类模块按钮权限码
 */
export const IN_APP_CATEGORY_PERMS = {
  /** 列表/树查询 */
  QUERY: 'message:category:query',
  /** 详情 */
  DETAIL: 'message:category:detail',
  /** 新增 */
  CREATE: 'message:category:create',
  /** 编辑 */
  UPDATE: 'message:category:update',
  /** 删除 */
  DELETE: 'message:category:delete',
} as const;
