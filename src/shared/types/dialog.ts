import type { BaseResponse } from '@/api/common/response';

/** 表单弹窗/抽屉数据契约 */
export interface FormDialog<T> {
  form?: T;
}

/** 详情弹窗/抽屉只读数据契约 */
export interface DetailDialog<T extends BaseResponse = BaseResponse> {
  data?: T;
}
