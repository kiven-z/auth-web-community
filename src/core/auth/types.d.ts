/** 鉴权恢复动作 */
export type RecoveryAction = 'refresh_and_retry' | 'logout' | 'pass_through';

/** 鉴权恢复上下文 */
export interface AuthRecoveryContext {
  status?: number;
  errorCode?: string;
  requestUrl?: string;
  isNoAuthPath: boolean;
  retryCount: number;
}

/** 鉴权恢复规则匹配器 */
interface AuthRecoveryRuleMatcher {
  statuses?: readonly number[];
  errorCodePatterns?: readonly string[];
  isNoAuthPath?: boolean;
}

/** 鉴权恢复规则 */
export interface AuthRecoveryRule {
  id: string;
  priority: number;
  matcher?: AuthRecoveryRuleMatcher;
  action: RecoveryAction;
  maxRetryTimes?: number;
  onRetryExhaustedAction?: RecoveryAction;
}

/** 鉴权恢复决策 */
export interface AuthRecoveryDecision {
  matchedRuleId: string;
  action: RecoveryAction;
  maxRetryTimes?: number;
}
