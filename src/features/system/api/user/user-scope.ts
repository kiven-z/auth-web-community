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
 * 保存用户数据范围（upsert；写后触发授权失效）
 * @param userId 用户 ID
 * @param data 范围表单
 */
export function upsertUserScope(userId: string, data: SysDataScopeForm) {
  return http.put<void, SysDataScopeForm>(`/system/user/${userId}/scope`, {
    data,
  });
}

/**
 * 清除用户数据范围覆盖（删除配置行，恢复角色继承）
 * @param userId 用户 ID
 */
export function deleteUserScope(userId: string) {
  return http.request<void>('delete', `/system/user/${userId}/scope`);
}
