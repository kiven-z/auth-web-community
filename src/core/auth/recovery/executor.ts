import { runAuthRecoverySideEffect } from '@/auth/config/auth/auth-recovery-effects';
import { replayRequestWithRefreshedToken } from '@/core/auth/tokenRefreshCoordinator';
import type { AuthHttpRequestConfig } from '@/core/http/types';
import type { AxiosInstance } from 'axios';
import { resolveAuthRecoveryDecision } from './resolver';
import type { AuthRecoveryContext, RecoveryAction } from './types';

/**
 * 执行鉴权恢复输入
 */
interface ExecuteAuthRecoveryInput {
  instance: AxiosInstance;
  requestConfig?: AuthHttpRequestConfig;
  context: AuthRecoveryContext;
}

/**
 * 执行鉴权恢复结果
 */
interface ExecuteAuthRecoveryResult {
  handled: boolean;
  action: RecoveryAction;
  matchedRuleId: string;
  replayResult?: unknown;
  shouldLogout?: boolean;
  replayError?: unknown;
}

/**
 * 统一执行鉴权恢复动作：
 * - refresh_and_retry：刷新 token 并重放原请求
 * - logout：交由调用方执行登出
 * - pass_through：不接管，继续原错误处理流程
 */
export async function executeAuthRecovery(input: ExecuteAuthRecoveryInput): Promise<ExecuteAuthRecoveryResult> {
  const decision = resolveAuthRecoveryDecision(input.context);

  // 无请求配置时直接透传，不执行任何恢复动作
  if (!input.requestConfig) {
    return {
      handled: false,
      action: 'pass_through',
      matchedRuleId: decision.matchedRuleId,
    };
  }

  // 鉴权恢复流程开始时的应用层副作用
  runAuthRecoverySideEffect(decision.matchedRuleId);

  // 决策动作
  switch (decision.action) {
    // 刷新令牌并重试
    case 'refresh_and_retry': {
      input.requestConfig._authRecoveryRetryCount = (input.requestConfig._authRecoveryRetryCount ?? 0) + 1;
      try {
        const replayResult = await replayRequestWithRefreshedToken(input.instance, input.requestConfig);
        return {
          handled: true,
          action: decision.action,
          matchedRuleId: decision.matchedRuleId,
          replayResult,
        };
      } catch (replayError) {
        return {
          handled: true,
          action: decision.action,
          matchedRuleId: decision.matchedRuleId,
          shouldLogout: true,
          replayError,
        };
      }
    }
    // 登出
    case 'logout':
      return {
        handled: true,
        action: decision.action,
        matchedRuleId: decision.matchedRuleId,
        shouldLogout: true,
      };
    default:
      return {
        handled: false,
        action: decision.action,
        matchedRuleId: decision.matchedRuleId,
      };
  }
}
