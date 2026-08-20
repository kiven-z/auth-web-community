/**
 * 数据范围类型（库表 scope_type 存储值；角色 / 用户共用）
 */
export type DataScopeType = 'ALL' | 'SELF' | 'DEPT' | 'DEPT_AND_CHILD';

/**
 * 数据范围保存表单（主体 ID 由 path 传入）
 */
export interface SysDataScopeForm {
  scopeType: DataScopeType;
  scopeDeptIds: string[];
  remark?: string | null;
}
