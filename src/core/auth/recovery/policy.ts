import { AUTH_ERROR_CODES } from '@/core/auth/error-codes';
import { AUTH_RECOVERY_RULE_IDS } from '@/core/auth/recovery/rule-ids';
import type { AuthRecoveryRule } from '../types';

const PRIORITY = {
  EXPIRED_REFRESH: 100,
  VERSION_CONFLICT_REFRESH: 90,
  UNAUTHORIZED_LOGOUT: 80,
  UNKNOWN_401_LOGOUT: 70,
  FALLBACK_PASS: 0,
} as const;

/**
 * 本地默认鉴权恢复策略（纯决策，不含 UI 副作用）：
 * - 过期/会话缺失（401/TOKEN_EXPIRED|SESSION_MISSING）优先刷新并重放
 * - 权限版本冲突（409/PERMISSION_VERSION_MISMATCH）刷新并重放一次
 * - 其余 401 默认登出
 */
export const LOCAL_AUTH_RECOVERY_RULES: readonly AuthRecoveryRule[] = [
  {
    id: AUTH_RECOVERY_RULE_IDS.TOKEN_EXPIRED_REFRESH,
    priority: PRIORITY.EXPIRED_REFRESH,
    matcher: {
      statuses: [401],
      errorCodePatterns: [
        AUTH_ERROR_CODES.TOKEN_EXPIRED,
        AUTH_ERROR_CODES.TOKEN_MISSING,
        AUTH_ERROR_CODES.SESSION_MISSING,
        AUTH_ERROR_CODES.NOT_AUTHENTICATED,
      ],
      isNoAuthPath: false,
    },
    action: 'refresh_and_retry',
    maxRetryTimes: 1,
    onRetryExhaustedAction: 'logout',
  },
  {
    id: AUTH_RECOVERY_RULE_IDS.PERMISSION_MISMATCH_REFRESH,
    priority: PRIORITY.VERSION_CONFLICT_REFRESH,
    matcher: {
      statuses: [409],
      errorCodePatterns: [AUTH_ERROR_CODES.PERMISSION_VERSION_MISMATCH],
      isNoAuthPath: false,
    },
    action: 'refresh_and_retry',
    maxRetryTimes: 1,
    onRetryExhaustedAction: 'pass_through',
  },
  {
    id: AUTH_RECOVERY_RULE_IDS.UNAUTHORIZED_LOGOUT,
    priority: PRIORITY.UNAUTHORIZED_LOGOUT,
    matcher: {
      statuses: [401],
      errorCodePatterns: [
        AUTH_ERROR_CODES.GATEWAY_UNAUTHORIZED,
        AUTH_ERROR_CODES.TOKEN_INVALID,
        AUTH_ERROR_CODES.TOKEN_KIND_MISMATCH,
        AUTH_ERROR_CODES.SESSION_DISABLED,
      ],
      isNoAuthPath: false,
    },
    action: 'logout',
  },
  {
    id: AUTH_RECOVERY_RULE_IDS.UNKNOWN_401_LOGOUT,
    priority: PRIORITY.UNKNOWN_401_LOGOUT,
    matcher: {
      statuses: [401],
      isNoAuthPath: false,
    },
    action: 'logout',
  },
  {
    id: AUTH_RECOVERY_RULE_IDS.FALLBACK_PASS,
    priority: PRIORITY.FALLBACK_PASS,
    action: 'pass_through',
  },
];
