import { transformI18n } from '@/app/plugins/i18n';
import type { ApiResult } from './types';

/** 与 common-starter-web / 网关稳定 error 对齐的用户文案键 */
const INFRA_ERROR_I18N_KEYS: Readonly<Record<string, string>> = {
  DATABASE_UNAVAILABLE: 'tips.databaseUnavailable',
  INTERNAL_ERROR: 'tips.serverUnavailable',
  GATEWAY_INTERNAL_ERROR: 'tips.serverUnavailable',
  UPSTREAM_UNAVAILABLE: 'tips.upstreamUnavailable',
  VALIDATION_FAILED: 'tips.validationFailed',
  UNREADABLE_BODY: 'tips.unreadableBody',
  METHOD_NOT_ALLOWED: 'tips.methodNotAllowed',
  DATA_TOO_LONG: 'tips.dataTooLong',
  DUPLICATE_ENTRY: 'tips.duplicateEntry',
};

const FALLBACK_I18N_KEY = 'tips.requestFailed';

/**
 * 将 API 信封解析为用户可见文案：
 * 基础设施稳定码 → 前端可解析的 i18nKey → message → 兜底。
 * @param result 业务信封
 * @returns 展示文案
 */
export function resolveApiErrorMessage(result: ApiResult): string {
  const errorCode = result.error;
  if (errorCode) {
    const tipKey = INFRA_ERROR_I18N_KEYS[errorCode];
    if (tipKey) {
      return transformI18n(tipKey);
    }
  }

  const i18nKey = result.ext?.i18nKey;
  if (i18nKey) {
    const localized = transformI18n(i18nKey);
    if (localized !== i18nKey) {
      return localized;
    }
  }

  const message = result.message?.trim();
  if (message) {
    return message;
  }

  return transformI18n(FALLBACK_I18N_KEY);
}
