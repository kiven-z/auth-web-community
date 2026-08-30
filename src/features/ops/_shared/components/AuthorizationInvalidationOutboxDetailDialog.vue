<script lang="tsx" setup>
import { createAuditDetailColumns } from '@/components/table/AuditColumns';
import { formatDateTime } from '@/shared/utils/date/dateTime';
import type { DetailDialog } from '@/shared/types/dialog';
import type { AuthorizationInvalidationOutboxDetailRow } from '@/features/ops/api/authorization-invalidation-outbox';
import Description from '@/components/ui/Description';
import useAuthorizationInvalidationOptions from '@/features/ops/_shared/hooks/options/useAuthorizationInvalidationOptions';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'AuthorizationInvalidationOutboxDetailDialog',
});

type AuthorizationInvalidationOutboxDetailDialogProps = DetailDialog<AuthorizationInvalidationOutboxDetailRow>;

defineProps<AuthorizationInvalidationOutboxDetailDialogProps>();
const { t } = useI18n();
const { changeKindOptions, outboxStatusOptions } = useAuthorizationInvalidationOptions();

const columns = computed(() => [
  {
    label: t('authorizationInvalidation.eventId'),
    prop: 'eventId',
    labelWidth: 140,
    copy: true,
  },
  {
    label: t('authorizationInvalidation.changeKind'),
    prop: 'changeKind',
    labelWidth: 140,
    cellRenderer: ({ value }: { value: string }) => {
      const option = changeKindOptions.value.find((item) => item.value === value);
      return <span>{option?.label ?? value}</span>;
    },
  },
  {
    label: t('authorizationInvalidation.outboxStatus'),
    prop: 'status',
    labelWidth: 140,
    cellRenderer: ({ value }: { value: string }) => {
      const option = outboxStatusOptions.value.find((item) => item.value === value);
      if (!option) {
        return <span>{value}</span>;
      }
      return (
        <ElTag type={option.tagType} effect="plain">
          {option.label}
        </ElTag>
      );
    },
  },
  {
    label: t('authorizationInvalidation.retryCount'),
    prop: 'retryCount',
    labelWidth: 140,
    cellRenderer: ({ row }: { row: Record<string, unknown> }) => (
      <span>
        {row.retryCount ?? '—'}/{row.maxRetry ?? '—'}
      </span>
    ),
  },
  {
    label: t('authorizationInvalidation.nextRetryAt'),
    prop: 'nextRetryAt',
    cellRenderer: ({ value }) => formatDateTime(value),
    labelWidth: 140,
  },
  {
    label: t('authorizationInvalidation.lastError'),
    prop: 'lastError',
    labelWidth: 140,
    copy: true,
  },
  {
    label: t('authorizationInvalidation.lockedBy'),
    prop: 'lockedBy',
    labelWidth: 140,
    copy: true,
  },
  {
    label: t('authorizationInvalidation.lockedAt'),
    prop: 'lockedAt',
    cellRenderer: ({ value }) => formatDateTime(value),
    labelWidth: 140,
  },
  {
    label: t('authorizationInvalidation.sourceModule'),
    prop: 'sourceModule',
    labelWidth: 140,
  },
  {
    label: t('authorizationInvalidation.sourceBizId'),
    prop: 'sourceBizId',
    labelWidth: 140,
    copy: true,
  },
  {
    label: t('authorizationInvalidation.payload'),
    prop: 'payload',
    labelWidth: 140,
    copy: true,
  },
  {
    label: t('authorizationInvalidation.processedAt'),
    prop: 'processedAt',
    cellRenderer: ({ value }) => formatDateTime(value),
    labelWidth: 140,
  },
  {
    label: t('authorizationInvalidation.remark'),
    prop: 'remark',
    labelWidth: 140,
    copy: true,
  },
  ...createAuditDetailColumns(),
]);
</script>

<template>
  <Description :column="2" :columns="columns" :data="data ?? {}" />
</template>
