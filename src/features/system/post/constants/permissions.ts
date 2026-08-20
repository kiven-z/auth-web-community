/**
 * 岗位管理模块按钮权限码
 */
export const SYS_POST_PERMS = {
  /** 分页查询、详情、关键词搜索、已分配角色查询 */
  QUERY: 'sys:post:query',
  /** 新增 */
  CREATE: 'sys:post:create',
  /** 编辑 */
  UPDATE: 'sys:post:update',
  /** 删除 */
  DELETE: 'sys:post:delete',
  /** Excel 导入、导入模板下载 */
  IMPORT: 'sys:post:import',
} as const;
