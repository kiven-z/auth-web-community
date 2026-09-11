import { recoverAuthFailure } from '@/core/auth/recover';
import { API_SUCCESS_CODE } from '@/core/config/http-config';
import { ApiTransportError, SessionEndedError, rejectWithApiEnvelopeError } from '@/core/http/api-error';
import { runSessionLogout } from '@/core/session/session-logout';
import { parseContentDispositionFilename } from '@/shared/utils/file/download';
import Axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { ApiResult, AuthHttpError, AuthHttpRequestConfig } from '../types';

/**
 * HTTP 失败体是否带业务信封（断网 / 代理 HTML 等没有 code）。
 */
function readErrorEnvelope(data: unknown): ApiResult | undefined {
  if (typeof data !== 'object' || data === null) {
    return undefined;
  }
  if (typeof (data as { code?: unknown }).code !== 'number') {
    return undefined;
  }
  return data as ApiResult;
}

/**
 * 响应拦截：Result 解包、业务错误；401/409 按 error 刷新重放或登出。
 * @param instance Axios 实例
 */
export function attachResponseInterceptors(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      const config = response.config as AuthHttpRequestConfig;
      const raw = response.data;

      if (config.responseType === 'blob' || config.responseType === 'arraybuffer') {
        if (config.blobWithFilename) {
          return {
            blob: raw,
            filename: parseContentDispositionFilename(response.headers['content-disposition']),
          };
        }
        return raw;
      }

      const envelope = raw as ApiResult;
      if (envelope.code !== API_SUCCESS_CODE) {
        return rejectWithApiEnvelopeError(envelope, response.status);
      }
      return envelope.data;
    },

    async (error: AuthHttpError) => {
      error.isCancelRequest = Axios.isCancel(error);
      const { response, config } = error;

      const status = response?.status;
      const requestConfig = config as AuthHttpRequestConfig | undefined;
      const envelope = readErrorEnvelope(response?.data);

      if (!requestConfig?.skipAuth && (status === 401 || status === 409)) {
        const authRecoveryResult = await recoverAuthFailure({
          instance,
          requestConfig,
          status,
          errorCode: envelope?.error,
        });

        if (authRecoveryResult.kind === 'replay') {
          return authRecoveryResult.replayResult;
        }
        if (authRecoveryResult.kind === 'logout') {
          await runSessionLogout();
          throw new SessionEndedError();
        }
      }
      if (envelope) {
        await rejectWithApiEnvelopeError(envelope, status ?? 0);
      }
      // 取消请求保持原错误，避免被当成业务失败提示
      if (error.isCancelRequest) {
        throw error;
      }

      throw new ApiTransportError(status, error);
    }
  );
}
