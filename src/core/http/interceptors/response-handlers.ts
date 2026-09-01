import { executeAuthRecovery } from '@/core/auth/recovery/executor';
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
 * 响应拦截：Result 解包、业务错误与鉴权恢复（优先刷新重放，失败后再登出）。
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
      const isNoAuthPath = Boolean(requestConfig?.skipAuth);
      const envelope = readErrorEnvelope(response?.data);
      const authEnvelopeErrorCode = envelope?.error;

      const authRecoveryResult = await executeAuthRecovery({
        instance,
        requestConfig,
        context: {
          status,
          errorCode: authEnvelopeErrorCode,
          requestUrl: requestConfig?.url,
          isNoAuthPath,
          retryCount: requestConfig?._authRecoveryRetryCount ?? 0,
        },
      });

      if (authRecoveryResult.handled && authRecoveryResult.replayResult !== undefined) {
        return authRecoveryResult.replayResult;
      }
      if (authRecoveryResult.shouldLogout) {
        await runSessionLogout();
        throw new SessionEndedError();
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
