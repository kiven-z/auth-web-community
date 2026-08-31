import type { AxiosError, AxiosRequestConfig, Method } from 'axios';

/**
 * 请求方法
 */
export type RequestMethods = Extract<Method, 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head'>;

/**
 * 鉴权 HTTP 错误
 */
export interface AuthHttpError extends AxiosError {
  isCancelRequest?: boolean;
}

/**
 * 鉴权 HTTP 请求配置
 * @param _authRecoveryRetryCount 鉴权恢复已重放次数，防止刷新重放死循环
 */
export interface AuthHttpRequestConfig extends AxiosRequestConfig {
  _authRecoveryRetryCount?: number;
  /** Blob 响应时一并解析 Content-Disposition 文件名 */
  blobWithFilename?: boolean;
  /** 公开接口：不注入 Authorization，失败不走鉴权恢复登出 */
  skipAuth?: boolean;
}

/**
 * 统一 API 结果信封中的扩展字段（含 auth 模块 i18n 元数据）
 */
export interface ApiResultExt {
  i18nKey?: string;
  i18nArgs?: unknown[];
  [key: string]: unknown;
}

/**
 * 统一 API 结果信封
 */
export interface ApiResult<T = unknown> {
  code: number;
  message?: string;
  error?: string;
  data?: T;
  ext?: ApiResultExt;
  timestamp?: number;
}
