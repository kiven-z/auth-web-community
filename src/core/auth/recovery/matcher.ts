import type { AuthRecoveryContext, AuthRecoveryRule } from '../types';

/**
 * 匹配状态
 * @param statuses 状态列表
 * @param status 状态
 * @returns 是否匹配
 */
function matchStatus(statuses: readonly number[] | undefined, status: number | undefined): boolean {
  if (!statuses) {
    return true;
  }
  if (status === undefined) {
    return false;
  }
  return statuses.includes(status);
}

/**
 * 匹配错误码模式
 * @param pattern 模式
 * @param errorCode 错误码
 * @returns 是否匹配
 */
function matchErrorCodePattern(pattern: string, errorCode: string): boolean {
  if (pattern === '*') {
    return true;
  }
  if (pattern.endsWith('*')) {
    const prefix = pattern.slice(0, -1);
    return errorCode.startsWith(prefix);
  }
  return errorCode === pattern;
}

/**
 * 匹配错误码
 * @param errorCodePatterns 错误码模式列表
 * @param errorCode 错误码
 * @returns 是否匹配
 */
function matchErrorCode(errorCodePatterns: readonly string[] | undefined, errorCode: string | undefined): boolean {
  if (!errorCodePatterns) {
    return true;
  }
  if (!errorCode) {
    return false;
  }
  return errorCodePatterns.some((pattern) => matchErrorCodePattern(pattern, errorCode));
}

/**
 * 匹配无权限路径
 * @param expectNoAuthPath 期望无权限路径
 * @param isNoAuthPath 是否无权限路径
 * @returns 是否匹配
 */
function matchNoAuthPath(expectNoAuthPath: boolean | undefined, isNoAuthPath: boolean): boolean {
  if (expectNoAuthPath === undefined) {
    return true;
  }
  return expectNoAuthPath === isNoAuthPath;
}

/**
 * 匹配规则
 * @param rule 规则
 * @param context 上下文
 * @returns 是否匹配
 */
function matchesRule(rule: AuthRecoveryRule, context: AuthRecoveryContext): boolean {
  const matcher = rule.matcher;
  if (!matcher) {
    return true;
  }
  return (
    matchStatus(matcher.statuses, context.status) &&
    matchErrorCode(matcher.errorCodePatterns, context.errorCode) &&
    matchNoAuthPath(matcher.isNoAuthPath, context.isNoAuthPath)
  );
}

/**
 * 规则匹配顺序：priority 高者优先，同优先级按声明顺序。
 */
export function findMatchedAuthRecoveryRule(
  rules: readonly AuthRecoveryRule[],
  context: AuthRecoveryContext
): AuthRecoveryRule {
  const orderedRules = [...rules].sort((left, right) => right.priority - left.priority);
  const matched = orderedRules.find((rule) => matchesRule(rule, context));
  if (!matched) {
    throw new Error('No auth recovery rule matched. Please provide a fallback pass-through rule.');
  }
  return matched;
}
