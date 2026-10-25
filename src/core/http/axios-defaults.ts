import { APP_CONFIG } from '@/core/config/app-config';
import Axios, { type AxiosInstance, type AxiosRequestConfig, type CustomParamsSerializer } from 'axios';
import { stringify } from 'qs';

/**
 * 创建带统一 baseURL、超时与序列化配置的 Axios 实例。
 */
export function createHttpAxiosInstance(): AxiosInstance {
  const defaultConfig: AxiosRequestConfig = {
    baseURL: APP_CONFIG.http.baseUrl,
    timeout: APP_CONFIG.http.timeout,
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
