import { findMatchedAuthRecoveryRule } from '@/core/auth/recovery/matcher';
import type { AuthRecoveryRule } from '@/core/auth/recovery/types';
import { describe, expect, it } from 'vitest';

describe('findMatchedAuthRecoveryRule', () => {
  it('matches higher priority rule first', () => {
    const rules: AuthRecoveryRule[] = [
      {
        id: 'low-priority',
        priority: 10,
        matcher: { statuses: [401] },
        action: 'logout',
      },
      {
        id: 'high-priority',
        priority: 100,
        matcher: { statuses: [401], errorCodePatterns: ['TOKEN_EXPIRED'] },
        action: 'refresh_and_retry',
      },
    ];

    const matched = findMatchedAuthRecoveryRule(rules, {
      status: 401,
      errorCode: 'TOKEN_EXPIRED',
      requestUrl: 'system/user/page',
      isNoAuthPath: false,
      retryCount: 0,
    });

    expect(matched.id).toBe('high-priority');
  });

  it('supports wildcard error code patterns', () => {
    const rules: AuthRecoveryRule[] = [
      {
        id: 'prefix-wildcard',
        priority: 50,
        matcher: { statuses: [401], errorCodePatterns: ['TOKEN_*'] },
        action: 'logout',
      },
      {
        id: 'fallback',
        priority: 0,
        action: 'pass_through',
      },
    ];

    const matched = findMatchedAuthRecoveryRule(rules, {
      status: 401,
      errorCode: 'TOKEN_INVALID',
      requestUrl: 'system/user/page',
      isNoAuthPath: false,
      retryCount: 0,
    });

    expect(matched.id).toBe('prefix-wildcard');
  });

  it('respects isNoAuthPath matcher option', () => {
    const rules: AuthRecoveryRule[] = [
      {
        id: 'logout-no-auth',
        priority: 100,
        matcher: { statuses: [401], isNoAuthPath: true },
        action: 'logout',
      },
      {
        id: 'fallback',
        priority: 0,
        action: 'pass_through',
      },
    ];

    const matched = findMatchedAuthRecoveryRule(rules, {
      status: 401,
      errorCode: 'TOKEN_INVALID',
      requestUrl: 'auth/refresh-token',
      isNoAuthPath: true,
      retryCount: 0,
    });

    expect(matched.id).toBe('logout-no-auth');
  });

  it('throws when no rule matches and fallback is absent', () => {
    const rules: AuthRecoveryRule[] = [
      {
        id: 'status-500-only',
        priority: 1,
        matcher: { statuses: [500] },
        action: 'pass_through',
      },
    ];

    expect(() =>
      findMatchedAuthRecoveryRule(rules, {
        status: 401,
        errorCode: 'TOKEN_INVALID',
        requestUrl: 'system/user/page',
        isNoAuthPath: false,
        retryCount: 0,
      })
    ).toThrow('No auth recovery rule matched.');
  });
});
