<script lang="tsx" setup>
import { createAuditDetailColumns } from '@/components/table/audit-columns';
import { formatDateTime } from '@/shared/utils/date/date-time';
import type { DetailDialog } from '@/shared/types/dialog';
import type { AuthorizationInvalidationEventDetailRow } from '@/features/ops/api/authorization-invalidation-event';
import Description from '@/components/ui/description';
import { SYS_AUTH_INVALIDATION_OUTBOX_PERMS } from '@/features/ops/_shared/constants/permissions';
import useAuthorizationInvalidationLinkedRecord from '@/features/ops/authorization-invalidation-event/hooks/use-authorization-invalidation-linked-record';
import useAuthorizationInvalidationOptions from '@/features/ops/_shared/hooks/options/use-authorization-invalidation-options';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'AuthorizationInvalidationEventDetailDialog',
});

type AuthorizationInvalidationEventDetailDialogProps = DetailDialog<AuthorizationInvalidationEventDetailRow>;

defineProps<AuthorizationInvalidationEventDetailDialogProps>();
const { t } = useI18n();
const { changeKindOptions, processingFilterOptions } = useAuthorizationInvalidationOptions();
const { openLinkedOutboxByEventId } = useAuthorizationInvalidationLinkedRecord();

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
    cellRenderer: ({ value }) => {
      const option = changeKindOptions.value.find((item) => item.value === value);
      return <span>{option?.label ?? value}</span>;
    },
  },
  {
    label: t('authorizationInvalidation.processing'),
    prop: 'processing',
    labelWidth: 140,
    cellRenderer: ({ value }) => {
      const option =
        processingFilterOptions.value.find((item) => item.value === value) ??
        processingFilterOptions.value.find((item) => item.value === false);
      if (!option) {
        return <span>—</span>;
      }
      return (
        <ElTag type={option.tagType} effect="plain">
          {option.label}
        </ElTag>
      );
    },
  },
  {
    label: t('authorizationInvalidation.impactedUserCount'),
    prop: 'impactedUserCount',
    labelWidth: 140,
  },
  {
    label: t('authorizationInvalidation.versionBumpedCount'),
    prop: 'versionBumpedCount',
    labelWidth: 140,
  },
  {
    label: t('authorizationInvalidation.profileRefreshedCount'),
    prop: 'profileRefreshedCount',
    labelWidth: 140,
  },
  {
    label: t('authorizationInvalidation.profileEvictedCount'),
    prop: 'profileEvictedCount',
    labelWidth: 140,
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
  <div>
    <div v-if="data.eventId" class="mb-3 flex justify-end">
      <el-button
        v-auth="SYS_AUTH_INVALIDATION_OUTBOX_PERMS.DETAIL"
        link
        type="primary"
        @click="openLinkedOutboxByEventId(data.eventId)"
      >
        {{ t('authorizationInvalidation.viewLinkedOutbox') }}
      </el-button>
    </div>

    <Description :column="2" :columns="columns" :data="data ?? {}" />
  </div>
</template>
