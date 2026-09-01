import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { createHttpAxiosInstance } from './axios-defaults';
import { attachRequestAuthInterceptor } from './interceptors/request-auth';
import { attachResponseInterceptors } from './interceptors/response-handlers';
import type { AuthHttpRequestConfig, RequestMethods } from './types';

class AuthHttp {
  private static readonly axiosInstance: AxiosInstance = createHttpAxiosInstance();

  constructor() {
    attachRequestAuthInterceptor(AuthHttp.axiosInstance);
    attachResponseInterceptors(AuthHttp.axiosInstance);
  }

  static getAxiosInstance(): AxiosInstance {
    return AuthHttp.axiosInstance;
  }

  public request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: AuthHttpRequestConfig
  ): Promise<T> {
    const config = {
      method,
      url,
      ...param,
      ...axiosConfig,
    } as AuthHttpRequestConfig;

    return this.requestWithConfig<T>(config);
  }

  public post<T, P>(url: string, params?: AxiosRequestConfig<P>, config?: AuthHttpRequestConfig): Promise<T> {
    return this.request<T>('post', url, params, config);
  }

  public put<T, P>(url: string, params?: AxiosRequestConfig<P>, config?: AuthHttpRequestConfig): Promise<T> {
    return this.request<T>('put', url, params, config);
  }

  public get<T, P>(url: string, params?: AxiosRequestConfig<P>, config?: AuthHttpRequestConfig): Promise<T> {
    return this.request<T>('get', url, params, config);
  }

  private requestWithConfig<T>(config: AuthHttpRequestConfig): Promise<T> {
    return AuthHttp.axiosInstance.request(config);
  }
}

/** 全局 HTTP 客户端（带鉴权与 Result 解包拦截器） */
export const http = new AuthHttp();
