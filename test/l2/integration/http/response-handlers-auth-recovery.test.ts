import { ApiTransportError, SessionEndedError } from '@/core/http/api-error';
import { attachResponseInterceptors } from '@/core/http/interceptors/response-handlers';
import axios, { type AxiosAdapter, type AxiosRequestConfig } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { recoverAuthFailureMock, logOutMock, rejectWithApiEnvelopeErrorMock } = vi.hoisted(() => ({
  recoverAuthFailureMock: vi.fn(),
  logOutMock: vi.fn(),
  rejectWithApiEnvelopeErrorMock: vi.fn(),
}));

vi.mock('@/core/auth/recover', () => ({
  recoverAuthFailure: recoverAuthFailureMock,
}));

vi.mock('@/core/session/session-logout', () => ({
  runSessionLogout: logOutMock,
}));

vi.mock('@/core/http/api-error', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/core/http/api-error')>();
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
    recoverAuthFailureMock.mockReset();
    rejectWithApiEnvelopeErrorMock.mockReset();
    logOutMock.mockReset();
  });

  it('returns replay result for 401 expired flow', async () => {
    recoverAuthFailureMock.mockResolvedValue({
      kind: 'replay',
      replayResult: { list: [1] },
    });

    const client = buildClient();
    const result = await client.request({
      url: 'system/message/email-template',
      method: 'get',
      adapter: rejectedAdapter(401, {
        code: 40104,
        error: 'TOKEN_EXPIRED',
      }),
    });

    expect(result).toEqual({ list: [1] });
    expect(logOutMock).not.toHaveBeenCalled();
  });

  it('logs out and throws SessionEndedError on invalid token', async () => {
    recoverAuthFailureMock.mockResolvedValue({
      kind: 'logout',
    });

    const client = buildClient();

    await expect(
      client.request({
        url: 'system/message/email-template',
        method: 'get',
        adapter: rejectedAdapter(401, {
          code: 40103,
          error: 'TOKEN_INVALID',
        }),
      })
    ).rejects.toBeInstanceOf(SessionEndedError);
    expect(logOutMock).toHaveBeenCalledTimes(1);
  });

  it('routes pass-through conflict to envelope error handler', async () => {
    const envelopeError = new Error('business conflict');
    recoverAuthFailureMock.mockResolvedValue({
      kind: 'pass_through',
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
        }),
      })
    ).rejects.toThrow('business conflict');

    expect(rejectWithApiEnvelopeErrorMock).toHaveBeenCalledTimes(1);
  });

  it('logs out with SessionEndedError when refresh replay fails', async () => {
    recoverAuthFailureMock.mockResolvedValue({
      kind: 'logout',
      replayError: new Error('refresh replay failed'),
    });

    const client = buildClient();

    await expect(
      client.request({
        url: 'system/message/email-template',
        method: 'get',
        adapter: rejectedAdapter(401, {
          code: 40104,
          error: 'TOKEN_EXPIRED',
        }),
      })
    ).rejects.toBeInstanceOf(SessionEndedError);

    expect(logOutMock).toHaveBeenCalledTimes(1);
  });

  it('throws ApiTransportError when pass-through has no envelope', async () => {
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

    expect(recoverAuthFailureMock).not.toHaveBeenCalled();
  });

  it('does not recover skipAuth 401', async () => {
    const envelopeError = new Error('bad credentials');
    rejectWithApiEnvelopeErrorMock.mockRejectedValue(envelopeError);

    const client = buildClient();

    await expect(
      client.request({
        url: 'auth/login/username',
        method: 'post',
        skipAuth: true,
        adapter: rejectedAdapter(401, {
          code: 1301,
          error: 'BAD_CREDENTIALS',
        }),
      } as AxiosRequestConfig)
    ).rejects.toThrow('bad credentials');

    expect(recoverAuthFailureMock).not.toHaveBeenCalled();
    expect(logOutMock).not.toHaveBeenCalled();
  });
});
