import { AUTH_RECOVERY_RULE_IDS } from '@/core/auth/recovery/ruleIds';
import { ApiTransportError, SessionEndedError } from '@/core/http/apiError';
import { attachResponseInterceptors } from '@/core/http/interceptors/responseHandlers';
import axios, { type AxiosAdapter, type AxiosRequestConfig } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { executeAuthRecoveryMock, logOutMock, rejectWithApiEnvelopeErrorMock } = vi.hoisted(() => ({
  executeAuthRecoveryMock: vi.fn(),
  logOutMock: vi.fn(),
  rejectWithApiEnvelopeErrorMock: vi.fn(),
}));

vi.mock('@/core/auth/recovery/executor', () => ({
  executeAuthRecovery: executeAuthRecoveryMock,
}));

vi.mock('@/core/session/sessionLogout', () => ({
  runSessionLogout: logOutMock,
}));

vi.mock('@/core/http/apiError', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/core/http/apiError')>();
  return {
    ...actual,
    rejectWithApiEnvelopeError: rejectWithApiEnvelopeErrorMock,
  };
});

vi.mock('@/app/plugins/i18n', () => ({
  transformI18n: (key: string) => key,
}));

function rejectedAdapter(status: number, data: unknown): AxiosAdapter {
  return async (config: AxiosRequestConfig) => {
    throw {
      config,
      response: {
        status,
        data,
        config,
        headers: {},
        statusText: 'error',
      },
      isAxiosError: true,
      name: 'AxiosError',
      message: 'Request failed with status code 401',
      toJSON: () => ({}),
    };
  };
}

function buildClient() {
  const instance = axios.create();
  attachResponseInterceptors(instance);
  return instance;
}

describe('responseHandlers auth recovery integration', () => {
  beforeEach(() => {
    executeAuthRecoveryMock.mockReset();
    rejectWithApiEnvelopeErrorMock.mockReset();
    logOutMock.mockReset();
  });

  it('returns replay result for 401 expired flow', async () => {
    executeAuthRecoveryMock.mockResolvedValue({
      handled: true,
      action: 'refresh_and_retry',
      matchedRuleId: AUTH_RECOVERY_RULE_IDS.TOKEN_EXPIRED_REFRESH,
      replayResult: { list: [1] },
    });

    const client = buildClient();
    const result = await client.request({
      url: 'system/message/email-template',
      method: 'get',
      adapter: rejectedAdapter(401, {
        code: 40104,
        error: 'TOKEN_EXPIRED',
        subCode: 'TOKEN_EXPIRED',
      }),
    });

    expect(result).toEqual({ list: [1] });
    expect(logOutMock).not.toHaveBeenCalled();
  });

  it('logs out and throws SessionEndedError on invalid token', async () => {
    executeAuthRecoveryMock.mockResolvedValue({
      handled: true,
      action: 'logout',
      matchedRuleId: AUTH_RECOVERY_RULE_IDS.UNAUTHORIZED_LOGOUT,
      shouldLogout: true,
    });

    const client = buildClient();

    await expect(
      client.request({
        url: 'system/message/email-template',
        method: 'get',
        adapter: rejectedAdapter(401, {
          code: 40103,
          error: 'TOKEN_INVALID',
          subCode: 'TOKEN_INVALID',
        }),
      })
    ).rejects.toBeInstanceOf(SessionEndedError);
    expect(logOutMock).toHaveBeenCalledTimes(1);
  });

  it('routes pass-through conflict to envelope error handler', async () => {
    const envelopeError = new Error('business conflict');
    executeAuthRecoveryMock.mockResolvedValue({
      handled: false,
      action: 'pass_through',
      matchedRuleId: AUTH_RECOVERY_RULE_IDS.PERMISSION_MISMATCH_REFRESH,
    });
    rejectWithApiEnvelopeErrorMock.mockRejectedValue(envelopeError);

    const client = buildClient();

    await expect(
      client.request({
        url: 'system/message/email-template',
        method: 'get',
        adapter: rejectedAdapter(409, {
          code: 406,
          error: 'PERMISSION_VERSION_MISMATCH',
          subCode: 'PERMISSION_VERSION_MISMATCH',
        }),
      })
    ).rejects.toThrow('business conflict');

    expect(rejectWithApiEnvelopeErrorMock).toHaveBeenCalledTimes(1);
  });

  it('logs out with SessionEndedError when refresh replay fails', async () => {
    const replayError = new Error('refresh replay failed');
    executeAuthRecoveryMock.mockResolvedValue({
      handled: true,
      action: 'refresh_and_retry',
      matchedRuleId: AUTH_RECOVERY_RULE_IDS.TOKEN_EXPIRED_REFRESH,
      shouldLogout: true,
      replayError,
    });

    const client = buildClient();

    await expect(
      client.request({
        url: 'system/message/email-template',
        method: 'get',
        adapter: rejectedAdapter(401, {
          code: 40104,
          error: 'TOKEN_EXPIRED',
          subCode: 'TOKEN_EXPIRED',
        }),
      })
    ).rejects.toBeInstanceOf(SessionEndedError);

    expect(logOutMock).toHaveBeenCalledTimes(1);
  });

  it('throws ApiTransportError when pass-through has no envelope', async () => {
    executeAuthRecoveryMock.mockResolvedValue({
      handled: false,
      action: 'pass_through',
      matchedRuleId: AUTH_RECOVERY_RULE_IDS.FALLBACK_PASS,
    });

    const client = buildClient();

    await expect(
      client.request({
        url: 'system/message/email-template',
        method: 'get',
        adapter: rejectedAdapter(502, 'Bad Gateway'),
      })
    ).rejects.toSatisfy((err: unknown) => {
      return err instanceof ApiTransportError && err.message === 'tips.requestFailed' && err.httpStatus === 502;
    });
  });
});
