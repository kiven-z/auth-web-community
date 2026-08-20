<script lang="ts" setup>
import {
  type AuthorizationInvalidationSummary,
  getAuthorizationInvalidationSummary,
} from '@/features/ops/api/authorization-invalidation-summary';
import StatMetricCard from '@/features/ops/authorization-invalidation-stats/components/StatMetricCard.vue';
import { errorMessage } from '@/services/feedback/message';
import { formatDateTime } from '@/shared/utils/date/dateTime';
import AuthorizationInvalidationFailureRateTrendCard from '@/features/ops/authorization-invalidation-stats/components/AuthorizationInvalidationFailureRateTrendCard.vue';
import { SYS_AUTH_INVALIDATION_OUTBOX_PERMS } from '@/features/ops/_shared/constants/permissions';
import useAuthorizationInvalidationStatsMetrics from '@/features/ops/authorization-invalidation-stats/hooks/useAuthorizationInvalidationStatsMetrics';
import { computed, onMounted, ref, unref, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'OpsAuthorizationInvalidationStats',
});

const { t } = useI18n();
const router = useRouter();

const trendCardRef = useTemplateRef<InstanceType<typeof AuthorizationInvalidationFailureRateTrendCard>>('trendCardRef');

const loading = ref(false);
const summary = ref<AuthorizationInvalidationSummary | null>(null);
const lastRefreshedAt = ref('');

const outboxStats = computed(() => summary.value?.outbox);
const eventStats = computed(() => summary.value?.event);
const { outboxMetrics, eventMetrics } = useAuthorizationInvalidationStatsMetrics(outboxStats, eventStats);

const trendLoading = computed(() => {
  const loadingState = trendCardRef.value?.trendLoading;
  return loadingState === undefined ? false : unref(loadingState);
});

/**
 * 拉取统计摘要
 */
async function reloadSummary() {
  loading.value = true;
  try {
    summary.value = await getAuthorizationInvalidationSummary();
    lastRefreshedAt.value = formatDateTime(new Date());
  } catch (error: unknown) {
    errorMessage(error);
  } finally {
    loading.value = false;
  }
}

/**
 * 刷新摘要与趋势
 */
async function reload() {
  await Promise.all([reloadSummary(), trendCardRef.value?.reloadTrend()]);
}

onMounted(() => {
  void reloadSummary();
});
</script>

<template>
  <div v-loading="loading" class="bg-auth-container px-4 pb-4 pt-3">
    <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
      <el-text v-if="lastRefreshedAt" type="info">
        {{ t('authorizationInvalidation.statsLastRefreshed', { time: lastRefreshedAt }) }}
      </el-text>
      <span v-else />
      <el-button
        v-auth="SYS_AUTH_INVALIDATION_OUTBOX_PERMS.QUERY"
        :loading="loading || trendLoading"
        type="primary"
        @click="reload"
      >
        {{ t('authorizationInvalidation.statsRefresh') }}
      </el-button>
    </div>

    <el-card class="mb-4" shadow="never">
      <template #header>
        <span>{{ t('authorizationInvalidation.statsOutboxSection') }}</span>
      </template>
      <el-row :gutter="12">
        <el-col v-for="metric in outboxMetrics" :key="metric.key" :lg="6" :md="8" :sm="12" :xs="24" class="mb-3">
          <StatMetricCard
            :clickable="metric.clickable"
            :footer="metric.footer"
            :precision="metric.precision"
            :suffix="metric.suffix"
            :title="metric.title"
            :tone="metric.tone"
            :tooltip="metric.tooltip"
            :value="metric.value"
            @click="() => router.push(metric.to)"
          />
        </el-col>
      </el-row>
    </el-card>

    <el-card class="mb-4" shadow="never">
      <template #header>
        <span>{{ t('authorizationInvalidation.statsEventSection') }}</span>
      </template>
      <el-row :gutter="12">
        <el-col v-for="metric in eventMetrics" :key="metric.key" :lg="8" :md="8" :sm="12" :xs="24" class="mb-3">
          <StatMetricCard
            :clickable="metric.clickable"
            :footer="metric.footer"
            :precision="metric.precision"
            :suffix="metric.suffix"
            :title="metric.title"
            :tone="metric.tone"
            :tooltip="metric.tooltip"
            :value="metric.value"
            @click="() => router.push(metric.to)"
          />
        </el-col>
      </el-row>
    </el-card>

    <AuthorizationInvalidationFailureRateTrendCard ref="trendCardRef" />
  </div>
</template>
