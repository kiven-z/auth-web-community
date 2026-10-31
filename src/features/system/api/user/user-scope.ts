import { http } from '@/core/http/client';
import type { DataScopeDimension, DataScopeType, SysDataScopeForm } from '@/features/system/api/models/data-scope';

export type { DataScopeDimension, DataScopeType, SysDataScopeForm } from '@/features/system/api/models/data-scope';

/**
 * 用户数据范围回显；无覆盖时接口返回空列表
 */
export interface SysUserScopeVO {
  id?: string;
  userId: string;
  dimension: DataScopeDimension;
  /** 范围类型：ALL / SELF / IDS / IDS_AND_CHILD */
  scopeType: DataScopeType;
  /** 节点 ID 列表；ALL/SELF 时为空列表 */
  scopeIds: string[];
  remark?: string | null;
}

/**
 * 查询用户数据范围配置（未配置返回空列表，表示继承角色）
 * @param userId 用户 ID
 * @returns 各数据维的范围配置
 */
export function getUserScope(userId: string) {
  return http.get<SysUserScopeVO[], unknown>(`/system/user/${userId}/scope`);
}

/**
 * 覆盖保存用户数据范围。空数组清除覆盖并恢复角色继承
 * @param userId 用户 ID
 * @param data 全部数据维；空数组表示清空
 */
export function replaceUserScope(userId: string, data: SysDataScopeForm[]) {
  return http.put<void, SysDataScopeForm[]>(`/system/user/${userId}/scope`, {
    data,
  });
}
