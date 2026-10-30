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
 * 把查询行收成表单列表。未配置或未知维不进入表单
 * @param rows 角色或用户的数据范围行
 * @returns 表单行；没有配置时为空数组
 */
export function toDataScopeForms(rows) {
  return (rows ?? []).flatMap((row) => {
    if (row.dimension !== 'DEPT') {
      return [];
    }
    return [
      {
        dimension: row.dimension,
        scopeType: row.scopeType,
        scopeIds: row.scopeIds ?? [],
        remark: row.remark,
      },
    ];
  });
}
