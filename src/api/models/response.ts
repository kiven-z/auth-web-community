/**
 * Long 主键与用户 ID 序列化为 string
 */
export interface BaseResponse {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  createdByName?: string | null;
  updatedByName?: string | null;
}

/**
 * 分页/列表行
 */
export interface BaseResponsePageRow extends BaseResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 详情 VO
 */
export interface BaseResponseDetail extends BaseResponse {
  id: string;
}
