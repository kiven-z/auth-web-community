/**
 * 渠道投递记录（发送记录）模块按钮权限码
 */
export const SEND_RECORD_PERMS = {
  /** 分页查询 */
  QUERY: 'message:delivery:query',
  /** 详情 */
  DETAIL: 'message:delivery:detail',
  /** 批量删除、单条删除 */
  DELETE: 'message:delivery:delete',
} as const;
