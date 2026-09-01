import type { PageResponse } from '@/api/common/page';
import type { RoleReference } from '@/features/system/api/models/grant-table';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/**
 * 菜单已绑定角色分页查询
 */
export interface MenuRolePageQuery {
  roleCode?: string;
  roleName?: string;
  status?: boolean;
  pageIndex?: number;
  pageSize?: number;
}

/**
 * 分页查询菜单已绑定角色
 * @param menuId 菜单 ID
 * @param params 查询条件
 * @returns 分页结果
 */
export function getMenuRolesPage(menuId: string, params: MenuRolePageQuery): Promise<PageResponse<RoleReference>> {
  return http.get<PageResponse<RoleReference>, AxiosRequestConfig<MenuRolePageQuery>>(
    `/system/menu/${menuId}/roles/page`,
    { params }
  );
}
