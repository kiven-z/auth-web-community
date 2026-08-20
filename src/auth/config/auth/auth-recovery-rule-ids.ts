/**
 * 鉴权恢复策略规则 ID（policy 定义与 runAuthRecoverySideEffect 副作用映射共用）。
 */
export const AUTH_RECOVERY_RULE_IDS = {
  TOKEN_EXPIRED_REFRESH: 'refresh-on-token-expired-or-session-missing',
  PERMISSION_MISMATCH_REFRESH: 'refresh-on-permission-version-mismatch',
  UNAUTHORIZED_LOGOUT: 'logout-on-unauthorized-invalid-token',
  UNKNOWN_401_LOGOUT: 'logout-on-unknown-401',
  FALLBACK_PASS: 'fallback-pass-through',
} as const;
