/**
 * 数据维（与库表 dimension、画像 dataScopes 的键一致）
 */
export type DataScopeDimension = 'DEPT';

/**
 * 数据范围类型（库表 scope_type 存储值；各数据维共用）
 */
export type DataScopeType = 'ALL' | 'SELF' | 'IDS' | 'IDS_AND_CHILD';

/**
 * 数据范围保存表单（主体 ID 由 path 传入）
 */
export interface SysDataScopeForm {
  dimension: DataScopeDimension;
  scopeType: DataScopeType;
  scopeIds: string[];
  remark?: string | null;
}
