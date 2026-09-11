import { transformI18n } from '@/app/plugins/i18n';
import { replayRequestWithRefreshedToken } from '@/core/auth/access-token-refresh';
import { AUTH_ERROR_CODES } from '@/core/auth/error-codes';
import type { AuthHttpRequestConfig } from '@/core/http/types';
import { message } from '@/services/feedback/message';
import type { AxiosInstance } from 'axios';

const REFRESHABLE_401_CODES: ReadonlySet<string> = new Set([
  AUTH_ERROR_CODES.TOKEN_EXPIRED,
  AUTH_ERROR_CODES.TOKEN_MISSING,
  AUTH_ERROR_CODES.SESSION_MISSING,
  AUTH_ERROR_CODES.NOT_AUTHENTICATED,
]);

const RECOVERY_TOAST_DURATION_MS = 5000;
const MAX_REPLAY_TIMES = 1;

type AuthRecoveryOutcome =
  | { kind: 'replay'; replayResult: unknown }
  | { kind: 'logout'; replayError?: unknown }
  | { kind: 'pass_through' };

interface RecoverAuthFailureInput {
  instance: AxiosInstance;
  requestConfig?: AuthHttpRequestConfig;
  status?: number;
  errorCode?: string;
}

interface RefreshPath {
  toastKey: string;
  onExhausted: { kind: 'logout' } | { kind: 'pass_through' };
}

function resolveRefreshPath(status?: number, errorCode?: string): RefreshPath | null {
  if (status === 409 && errorCode === AUTH_ERROR_CODES.PERMISSION_VERSION_MISMATCH) {
    return { toastKey: 'tips.permissionMismatchRefreshRetry', onExhausted: { kind: 'pass_through' } };
  }
  if (status === 401 && errorCode !== undefined && REFRESHABLE_401_CODES.has(errorCode)) {
    return { toastKey: 'tips.tokenExpiredRefreshRetry', onExhausted: { kind: 'logout' } };
  }
  return null;
}

async function refreshAndReplay(
  instance: AxiosInstance,
  requestConfig: AuthHttpRequestConfig,
  onError: { kind: 'logout' } | { kind: 'pass_through' }
): Promise<AuthRecoveryOutcome> {
  requestConfig._authRecoveryRetryCount = (requestConfig._authRecoveryRetryCount ?? 0) + 1;
  try {
    return { kind: 'replay', replayResult: await replayRequestWithRefreshedToken(instance, requestConfig) };
  } catch (replayError) {
    return onError.kind === 'logout' ? { kind: 'logout', replayError } : { kind: 'pass_through' };
  }
}

/**
 * 按 HTTP 状态与 `error` 恢复已登录请求：可续则刷新重放一次，不可续则登出，其余透传。
 * @param input 失败请求、HTTP 状态与稳定 error
 * @returns 重放成功、应登出、或交回原错误处理
 */
export async function recoverAuthFailure(input: RecoverAuthFailureInput): Promise<AuthRecoveryOutcome> {
  const { instance, requestConfig, status, errorCode } = input;
  if (!requestConfig || requestConfig.skipAuth) return { kind: 'pass_through' };

  const refreshPath = resolveRefreshPath(status, errorCode);
  if (refreshPath) {
    if ((requestConfig._authRecoveryRetryCount ?? 0) >= MAX_REPLAY_TIMES) {
      return refreshPath.onExhausted;
    }
    message(transformI18n(refreshPath.toastKey), {
      type: 'warning',
      duration: RECOVERY_TOAST_DURATION_MS,
      grouping: true,
      showClose: true,
    });
    return refreshAndReplay(instance, requestConfig, refreshPath.onExhausted);
  }

  return status === 401 ? { kind: 'logout' } : { kind: 'pass_through' };
}