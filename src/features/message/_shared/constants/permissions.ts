/**
 * 消息模板公共权限码
 */
export const MESSAGE_TEMPLATE_PERMS = {
  /** 分页查询 */
  QUERY: 'message:template:query',
  /** 详情、预览 */
  DETAIL: 'message:template:detail',
  /** 新增 */
  CREATE: 'message:template:create',
  /** 编辑、启停、测试发送、变量维护 */
  UPDATE: 'message:template:update',
  /** 删除 */
  DELETE: 'message:template:delete',
} as const;
