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

/**
 * 范围类型是否需要提交节点 ID
 * @param scopeType 范围类型
 * @returns IDS / IDS_AND_CHILD 为 true
 */
export function scopeTypeRequiresIds(scopeType: DataScopeType): boolean {
  return scopeType === 'IDS' || scopeType === 'IDS_AND_CHILD';
}

/**
 * 部门维表单默认值；回显时只覆盖类型、节点和备注
 * @param source 已有配置行
 * @returns 部门维表单
 */
export function createDeptScopeForm(source?: {
  scopeType?: DataScopeType;
  scopeIds?: string[] | null;
  remark?: string | null;
}): SysDataScopeForm {
  return {
    dimension: 'DEPT',
    scopeType: source?.scopeType ?? 'SELF',
    scopeIds: source?.scopeIds?.length ? [...source.scopeIds] : [],
    remark: source?.remark ?? undefined,
  };
}

/**
 * 从按维返回的配置列表中取部门维
 * @param rows 配置行
 * @returns 部门维行；没有时为 undefined
 */
export function findDeptScope<T extends { dimension: string }>(rows: readonly T[] | null | undefined): T | undefined {
  return rows?.find((row) => row.dimension === 'DEPT');
}
