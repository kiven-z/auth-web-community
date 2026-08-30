import type {
  AuthorizationInvalidationEventStats,
  AuthorizationInvalidationOutboxStats,
} from '@/features/ops/api/authorizationInvalidationSummary';
import type { StatMetricTone } from '@/features/ops/authorization-invalidation-stats/components/statMetricTypes';
import { computed, type ComputedRef, type MaybeRefOrGetter, toValue } from 'vue';
import { useI18n } from 'vue-i18n';
import type { RouteLocationRaw } from 'vue-router';

/** 失败率告警阈值（百分比） */
export const FAILURE_RATE_DANGER_PERCENT = 5;
/** 失败率关注阈值（百分比） */
export const FAILURE_RATE_WARNING_PERCENT = 1;

/** 单个统计 KPI 展示项 */
export interface AuthorizationInvalidationStatMetric {
  key: string;
  title: string;
  value: number;
  precision?: number;
  suffix?: string;
  footer?: string;
  tone: StatMetricTone;
  tooltip?: string;
  clickable: boolean;
  to: RouteLocationRaw;
}

/**
 * 授权失效运维页面路径
 */
const AUTH_INVALIDATION_ROUTES = {
  EVENT: '/ops/authorization-invalidation-event',
  OUTBOX: '/ops/authorization-invalidation-outbox',
  STATS: '/ops/authorization-invalidation-stats',
} as const;

/**
 * 解析失败率数值
 * @param value 接口返回的失败率
 * @returns 百分比数值
 */
function toFailureRateNumber(value: number | string | undefined | null): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

/**
 * 按失败率阈值映射语义色
 * @param rate 失败率百分比
 * @returns 语义色
 */
function resolveFailureRateTone(rate: number): StatMetricTone {
  if (rate >= FAILURE_RATE_DANGER_PERCENT) {
    return 'danger';
  }
  if (rate >= FAILURE_RATE_WARNING_PERCENT) {
    return 'warning';
  }
  return 'success';
}

/**
 * 将统计计数字段规范为有限数字（多处 KPI 共用）
 * @param value 接口返回的计数
 * @returns 非有限值时回落为 0
 */
function toCount(value: number | undefined | null): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

/**
 * 授权失效统计 KPI 组装
 * @param outbox Outbox 统计
 * @param event 幂等事件统计
 * @returns Outbox / Event 两组 KPI
 */
function useAuthorizationInvalidationStatsMetrics(
  outbox: MaybeRefOrGetter<AuthorizationInvalidationOutboxStats | null | undefined>,
  event: MaybeRefOrGetter<AuthorizationInvalidationEventStats | null | undefined>
): {
  outboxMetrics: ComputedRef<AuthorizationInvalidationStatMetric[]>;
  eventMetrics: ComputedRef<AuthorizationInvalidationStatMetric[]>;
} {
  const { t } = useI18n();

  function formatShare(part: number, total: number): string {
    const percent = total > 0 ? ((part / total) * 100).toFixed(2) : '0.00';
    return t('authorizationInvalidation.statsShareOfTotal', { percent });
  }

  const outboxMetrics = computed<AuthorizationInvalidationStatMetric[]>(() => {
    const stats = toValue(outbox) ?? {};
    const total = toCount(stats.totalCount);
    const pending = toCount(stats.pendingCount);
    const processing = toCount(stats.processingCount);
    const success = toCount(stats.successCount);
    const failed = toCount(stats.failedCount);
    const dead = toCount(stats.deadCount);
    const failureRate = toFailureRateNumber(stats.failureRatePercent);
    const abnormalCount = failed + dead;

    return [
      {
        key: 'outbox-total',
        title: t('authorizationInvalidation.statsTotalCount'),
        value: total,
        tone: 'default',
        clickable: true,
        to: { path: AUTH_INVALIDATION_ROUTES.OUTBOX },
      },
      {
        key: 'outbox-pending',
        title: t('authorizationInvalidation.outboxStatusEnum.PENDING'),
        value: pending,
        footer: formatShare(pending, total),
        tone: pending > 0 ? 'info' : 'default',
        clickable: true,
        to: { path: AUTH_INVALIDATION_ROUTES.OUTBOX, query: { status: 'PENDING' } },
      },
      {
        key: 'outbox-processing',
        title: t('authorizationInvalidation.outboxStatusEnum.PROCESSING'),
        value: processing,
        footer: formatShare(processing, total),
        tone: processing > 0 ? 'warning' : 'default',
        clickable: true,
        to: { path: AUTH_INVALIDATION_ROUTES.OUTBOX, query: { status: 'PROCESSING' } },
      },
      {
        key: 'outbox-success',
        title: t('authorizationInvalidation.outboxStatusEnum.SUCCESS'),
        value: success,
        footer: formatShare(success, total),
        tone: 'success',
        clickable: true,
        to: { path: AUTH_INVALIDATION_ROUTES.OUTBOX, query: { status: 'SUCCESS' } },
      },
      {
        key: 'outbox-failed',
        title: t('authorizationInvalidation.outboxStatusEnum.FAILED'),
        value: failed,
        footer: formatShare(failed, total),
        tone: failed > 0 ? 'danger' : 'default',
        clickable: true,
        to: { path: AUTH_INVALIDATION_ROUTES.OUTBOX, query: { status: 'FAILED' } },
      },
      {
        key: 'outbox-dead',
        title: t('authorizationInvalidation.outboxStatusEnum.DEAD'),
        value: dead,
        footer: formatShare(dead, total),
        tone: dead > 0 ? 'danger' : 'default',
        tooltip: t('authorizationInvalidation.statsDeadTooltip'),
        clickable: true,
        to: { path: AUTH_INVALIDATION_ROUTES.OUTBOX, query: { status: 'DEAD' } },
      },
      {
        key: 'outbox-failure-rate',
        title: t('authorizationInvalidation.statsFailureRate'),
        value: failureRate,
        precision: 2,
        suffix: '%',
        footer: t('authorizationInvalidation.statsAbnormalCount', { count: abnormalCount }),
        tone: resolveFailureRateTone(failureRate),
        tooltip: t('authorizationInvalidation.statsFailureRateTooltip'),
        clickable: true,
        to: { path: AUTH_INVALIDATION_ROUTES.OUTBOX, query: { status: 'FAILED' } },
      },
    ];
  });

  const eventMetrics = computed<AuthorizationInvalidationStatMetric[]>(() => {
    const stats = toValue(event) ?? {};
    const total = toCount(stats.totalCount);
    const processing = toCount(stats.processingCount);
    const completed = toCount(stats.completedCount);

    return [
      {
        key: 'event-total',
        title: t('authorizationInvalidation.statsTotalCount'),
        value: total,
        tone: 'default',
        clickable: true,
        to: { path: AUTH_INVALIDATION_ROUTES.EVENT },
      },
      {
        key: 'event-processing',
        title: t('authorizationInvalidation.processingEnum.true'),
        value: processing,
        footer: formatShare(processing, total),
        tone: processing > 0 ? 'warning' : 'default',
        clickable: true,
        to: { path: AUTH_INVALIDATION_ROUTES.EVENT, query: { processing: 'true' } },
      },
      {
        key: 'event-completed',
        title: t('authorizationInvalidation.processingEnum.false'),
        value: completed,
        footer: formatShare(completed, total),
        tone: 'success',
        clickable: true,
        to: { path: AUTH_INVALIDATION_ROUTES.EVENT, query: { processing: 'false' } },
      },
    ];
  });

  return { outboxMetrics, eventMetrics };
}

export default useAuthorizationInvalidationStatsMetrics;
