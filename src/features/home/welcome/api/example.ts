import type { PageResponse, SortSpec } from '@/api/common/page';
import type { AxiosRequestConfig } from 'axios';

import { http } from '@/core/http/client';

/**
 * 部门维数据范围（开发期 example 演示）
 */
export interface ExampleScopeGrant {
  scopeType?: string;
  values?: string[];
}

/**
 * 授权画像（开发期 example /me 回显）
 */
export interface ExampleAuthProfile {
  userId?: string;
  username?: string;
  roles?: string[];
  permissions?: string[];
  deptScope?: ExampleScopeGrant | null;
  permVersion?: string;
}

/**
 * 数据权限演示单行
 */
export interface ExampleOrderRow {
  id?: string;
  title?: string;
  deptId?: string;
  createdBy?: string;
}

/**
 * 数据权限演示单分页查询
 */
export interface ExampleOrderPageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  id?: string;
  title?: string;
  deptId?: string;
}

/**
 * 查询当前登录用户授权画像
 * @returns 授权画像
 */
export function getExampleMe() {
  return http.get<ExampleAuthProfile | null, unknown>('/example/me');
}

/**
 * 分页查询数据权限过滤后的演示订单
 * @param params 分页与筛选条件
 * @returns 分页数据
 */
export function queryExampleOrderPage(params: ExampleOrderPageQuery) {
  return http.get<PageResponse<ExampleOrderRow>, AxiosRequestConfig<ExampleOrderPageQuery>>('/example/orders', {
    params,
  });
}
