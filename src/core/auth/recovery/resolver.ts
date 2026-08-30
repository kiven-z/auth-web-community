import { findMatchedAuthRecoveryRule } from './matcher';
import { LOCAL_AUTH_RECOVERY_RULES } from './policy';
import type { AuthRecoveryContext, AuthRecoveryDecision, AuthRecoveryRule, RecoveryAction } from './types';

/**
 * 根据重试状态解析恢复动作
 * @param action 恢复动作
 * @param retryCount 重试次数
 * @param maxRetryTimes 最大重试次数
 * @param onRetryExhaustedAction 重试耗尽动作
 * @returns 恢复动作和重试耗尽状态
 */
function resolveActionByRetryState(
  action: RecoveryAction,
  retryCount: number,
  maxRetryTimes: number | undefined,
  onRetryExhaustedAction: RecoveryAction | undefined
): RecoveryAction {
  if (action !== 'refresh_and_retry') {
    return action;
  }
  const retryLimit = maxRetryTimes ?? 1;
  if (retryCount < retryLimit) {
    return action;
  }
  return onRetryExhaustedAction ?? 'pass_through';
}

/**
 * 解析鉴权恢复决策
 * @param context 上下文
 * @param rules 规则
 * @returns 鉴权恢复决策
 */
export function resolveAuthRecoveryDecision(
  context: AuthRecoveryContext,
  rules: readonly AuthRecoveryRule[] = LOCAL_AUTH_RECOVERY_RULES
): AuthRecoveryDecision {
  // 解析生效规则集
  const effectiveRules = rules ?? LOCAL_AUTH_RECOVERY_RULES;
  // 匹配规则
  const matchedRule = findMatchedAuthRecoveryRule(effectiveRules, context);
  // 解析恢复动作
  return {
    matchedRuleId: matchedRule.id,
    action: resolveActionByRetryState(
      matchedRule.action,
      context.retryCount,
      matchedRule.maxRetryTimes,
      matchedRule.onRetryExhaustedAction
    ),
    maxRetryTimes: matchedRule.maxRetryTimes,
  };
}
