import { HTTP_BASE_URL, HTTP_TIMEOUT } from '@/auth/config/http-config';
import Axios, { type AxiosInstance, type AxiosRequestConfig, type CustomParamsSerializer } from 'axios';
import { stringify } from 'qs';

/**
 * 创建带统一 baseURL、超时与序列化配置的 Axios 实例（供 HTTP 封装使用）。
 */
export function createHttpAxiosInstance(): AxiosInstance {
  const defaultConfig: AxiosRequestConfig = {
    baseURL: HTTP_BASE_URL,
    timeout: HTTP_TIMEOUT,
    withCredentials: true,
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    paramsSerializer: {
      serialize: stringify as unknown as CustomParamsSerializer,
    },
  };
  return Axios.create(defaultConfig);
}
