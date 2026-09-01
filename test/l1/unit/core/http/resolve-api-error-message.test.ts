import { resolveApiErrorMessage } from '@/core/http/resolve-api-error-message';
import { describe, expect, it, vi } from 'vitest';

/** 模拟：前端已有的键返回可区分译文；未知键原样返回（与真实 transformI18n 未命中行为一致） */
const KNOWN_FRONTEND_KEYS = new Set([
  'tips.requestFailed',
  'tips.databaseUnavailable',
  'tips.serverUnavailable',
  'tips.upstreamUnavailable',
  'tips.validationFailed',
  'tips.unreadableBody',
  'tips.methodNotAllowed',
  'tips.dataTooLong',
  'tips.duplicateEntry',
  'tips.customBusiness',
]);

vi.mock('@/app/plugins/i18n', () => ({
  transformI18n: (key: string) => (KNOWN_FRONTEND_KEYS.has(key) ? `i18n:${key}` : key),
}));

describe('resolveApiErrorMessage', () => {
  it('maps DATABASE_UNAVAILABLE over English message', () => {
    expect(
      resolveApiErrorMessage({
        code: 500,
        error: 'DATABASE_UNAVAILABLE',
        message: 'Database operation failed.',
      })
    ).toBe('i18n:tips.databaseUnavailable');
  });

  it('maps GATEWAY_INTERNAL_ERROR to serverUnavailable', () => {
    expect(
      resolveApiErrorMessage({
        code: 500,
        error: 'GATEWAY_INTERNAL_ERROR',
        message: 'Gateway internal error.',
      })
    ).toBe('i18n:tips.serverUnavailable');
  });

  it('uses business message when error code is not infra-mapped', () => {
    expect(
      resolveApiErrorMessage({
        code: 1301,
        error: 'BAD_CREDENTIALS',
        message: '用户名或密码错误',
      })
    ).toBe('用户名或密码错误');
  });

  it('falls back to tips.requestFailed when no code message or resolvable i18nKey', () => {
    expect(resolveApiErrorMessage({ code: 400 })).toBe('i18n:tips.requestFailed');
  });

  it('prefers resolvable ext.i18nKey over message', () => {
    expect(
      resolveApiErrorMessage({
        code: 400,
        message: 'English fallback',
        ext: { i18nKey: 'tips.customBusiness' },
      })
    ).toBe('i18n:tips.customBusiness');
  });

  it('falls back to message when ext.i18nKey is unknown to frontend', () => {
    expect(
      resolveApiErrorMessage({
        code: 400,
        message: 'Data anomaly',
        ext: { i18nKey: 'database.error', i18nArgs: ['querySnapshotJson'] },
      })
    ).toBe('Data anomaly');
  });
});
