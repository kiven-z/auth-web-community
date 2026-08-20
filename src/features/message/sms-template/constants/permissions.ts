/**
 * 短信模板模块按钮权限码
 */
export const SMS_TEMPLATE_PERMS = {
  /** 分页查询 */
  QUERY: 'message:template:query',
  /** 详情 */
  DETAIL: 'message:template:detail',
  /** 新增 */
  CREATE: 'message:template:create',
  /** 编辑、批量启停、测试发送、变量维护 */
  UPDATE: 'message:template:update',
  /** 删除 */
  DELETE: 'message:template:delete',
} as const;
