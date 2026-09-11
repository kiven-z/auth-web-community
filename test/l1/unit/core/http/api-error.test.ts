import {
  ApiBusinessError,
  ApiConflictError,
  ApiTransportError,
  SessionEndedError,
  rejectWithApiEnvelopeError,
  shouldSkipErrorFeedback,
} from '@/core/http/api-error';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/app/plugins/i18n', () => ({
  transformI18n: (key: string) => key,
}));

describe('apiError types', () => {
  it('uses envelope message for ApiBusinessError', () => {
    const err = new ApiBusinessError({ code: 1301, message: '用户名或密码错误', error: 'BAD_CREDENTIALS' }, 401);
    expect(err.message).toBe('用户名或密码错误');
    expect(err.errorCode).toBe('BAD_CREDENTIALS');
    expect(err.httpStatus).toBe(401);
  });

  it('maps infra error code over English envelope message', () => {
    const err = new ApiBusinessError(
      {
        code: 500,
        error: 'INTERNAL_ERROR',
        message: 'Internal server error.',
      },
      500
    );
    expect(err.message).toBe('tips.serverUnavailable');
  });

  it('falls back to tips.requestFailed when envelope has no message', () => {
    const err = new ApiBusinessError({ code: 400 }, 400);
    expect(err.message).toBe('tips.requestFailed');
  });

  it('builds ApiConflictError for permission mismatch via instanceof', () => {
    const err = new ApiConflictError(
      {
        code: 406,
        message: '权限版本不匹配',
        error: 'PERMISSION_VERSION_MISMATCH',
      },
      409
    );
    expect(err).toBeInstanceOf(ApiBusinessError);
    expect(err.name).toBe('ApiConflictError');
  });

  it('rejects 409 permission mismatch as ApiConflictError', async () => {
    await expect(
      rejectWithApiEnvelopeError({ code: 406, error: 'PERMISSION_VERSION_MISMATCH', message: 'x' }, 409)
    ).rejects.toBeInstanceOf(ApiConflictError);
  });

  it('ApiTransportError uses tips.requestFailed', () => {
    const cause = new Error('ECONNREFUSED');
    const err = new ApiTransportError(502, cause);
    expect(err.message).toBe('tips.requestFailed');
    expect(err.httpStatus).toBe(502);
    expect(err.name).toBe('ApiTransportError');
    expect(err.cause).toBe(cause);
  });

  it('SessionEndedError and cancel skip feedback; transport does not', () => {
    expect(shouldSkipErrorFeedback(new SessionEndedError())).toBe(true);
    expect(shouldSkipErrorFeedback({ isCancelRequest: true })).toBe(true);
    expect(shouldSkipErrorFeedback(new ApiTransportError(502))).toBe(false);
    expect(shouldSkipErrorFeedback(new ApiBusinessError({ code: 1, message: 'x' }))).toBe(false);
  });
});
