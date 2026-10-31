import { http } from '@/core/http/client';
import type { DataScopeDimension, DataScopeType, SysDataScopeForm } from '@/features/system/api/models/data-scope';

export type { DataScopeDimension, DataScopeType, SysDataScopeForm } from '@/features/system/api/models/data-scope';

/**
 * 角色数据范围回显
 */
export interface SysRoleScopeVO {
  id?: string;
  roleId: string;
  dimension: DataScopeDimension;
  scopeType: DataScopeType;
  scopeIds: string[];
  remark?: string | null;
}

/**
 * 查询角色数据范围；未配置时后端返回空列表
 * @param roleId 角色 ID
 * @returns 各数据维的范围配置
 */
export function getRoleScope(roleId: string) {
  return http.get<SysRoleScopeVO[], unknown>(`/system/role/${roleId}/scope`);
}

/**
 * 覆盖保存角色数据范围
 * @param roleId 角色 ID
 * @param data 全部数据维；空数组表示清空
 */
export function replaceRoleScope(roleId: string, data: SysDataScopeForm[]) {
  return http.put<void, SysDataScopeForm[]>(`/system/role/${roleId}/scope`, {
    data,
  });
}
