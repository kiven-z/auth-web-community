import { transformI18n } from '@/app/plugins/i18n';
import { runSessionLogout } from '@/auth/config/auth/auth-session-effects';
import { API_SUCCESS_CODE, isNoAuthRequestPath } from '@/auth/config/http-config';
import { executeAuthRecovery } from '@/core/auth/recovery/executor';
import { isApiResultEnvelope } from '@/core/http/apiResult';
import { rejectWithApiEnvelopeError } from '@/core/http/errorAdapter';
import { parseContentDispositionFilename } from '@/shared/utils/file/download';
import Axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { AuthHttpError, AuthHttpRequestConfig } from '../types';

/**
 * 响应拦截：Result 解包、业务错误与鉴权恢复（优先刷新重放，失败后再登出）。
 * @param instance Axios 实例
 */
export function attachResponseInterceptors(instance: AxiosInstance): void {
  instance.interceptors.response.use(
    (response: AxiosResponse) => handleResponseSuccess(response),
    (error: AuthHttpError) => handleResponseError(instance, error) as unknown
  );
}

/** Blob / Result 信封解包；业务码非成功则转错误拒绝 */
function handleResponseSuccess(response: AxiosResponse) {
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

  if (isApiResultEnvelope(raw)) {
    if (raw.code !== API_SUCCESS_CODE) {
      return rejectWithApiEnvelopeError(raw, response.status);
    }
    return raw.data;
  }

  return raw;
}

/** 鉴权恢复（刷新重放）或登出；信封错误走统一拒绝 */
async function handleResponseError(instance: AxiosInstance, error: AuthHttpError): Promise<unknown> {
  error.isCancelRequest = Axios.isCancel(error);
  const { response, config } = error;

  const status = response?.status;
  const requestConfig = config as AuthHttpRequestConfig | undefined;
  const isNoAuthPath = requestConfig ? isNoAuthRequestPath(requestConfig.url) : false;
  const envelope = response?.data && isApiResultEnvelope(response.data) ? response.data : undefined;
  const authEnvelopeErrorCode = envelope?.error ?? envelope?.subCode;

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
    throw authRecoveryResult.replayError ?? error;
  }
  if (envelope) {
    await rejectWithApiEnvelopeError(envelope, status ?? 0);
  }
  // 取消请求保持原错误，避免被当成业务失败提示
  if (error.isCancelRequest) {
    throw error;
  }

  // 无业务信封：改写文案后抛出，保留 status / config 便于排查（后端未启动、代理 5xx、断网等）
  error.message = transformI18n('tips.requestFailed');
  throw error;
}
