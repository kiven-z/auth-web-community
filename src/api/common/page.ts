export type SortDirectionApi = 'ASC' | 'DESC';

/** 列表排序规格 */
export interface SortSpec {
  field: string;
  direction?: SortDirectionApi;
}

/** 分页响应 */
export interface PageResponse<T> {
  pageNo: number;
  pageSize: number;
  pages: number;
  total: number;
  list: T[];
}
