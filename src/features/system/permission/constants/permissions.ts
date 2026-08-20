/**
 * 权限管理模块按钮权限码
 */
export const SYS_PERMISSION_PERMS = {
  /** 分页查询 */
  QUERY: 'sys:permission:query',
  /** 查看详情 */
  DETAIL: 'sys:permission:detail',
  /** 新增 */
  CREATE: 'sys:permission:create',
  /** 编辑 */
  UPDATE: 'sys:permission:update',
  /** 删除 */
  DELETE: 'sys:permission:delete',
  /** Excel 导入、导入模板下载 */
  IMPORT: 'sys:permission:import',
} as const;
