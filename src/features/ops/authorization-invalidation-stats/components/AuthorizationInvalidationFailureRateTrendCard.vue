<script lang="ts" setup>
import {
  type AuthorizationInvalidationFailureRateTrend,
  type AuthorizationInvalidationFailureRateTrendGranularity,
  getAuthorizationInvalidationFailureRateTrend,
} from '@/features/ops/api/authorization-invalidation-summary';
import { errorMessage } from '@/services/feedback/message';
import { useECharts } from '@/shared/composables/charts/use-e-charts';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'AuthorizationInvalidationFailureRateTrendCard',
});
const { t } = useI18n();

const trendLoading = ref(false);
const trend = ref<AuthorizationInvalidationFailureRateTrend | null>(null);
const granularity = ref<AuthorizationInvalidationFailureRateTrendGranularity>('DAY');
const trendDays = ref(30);

const chartRef = ref<HTMLDivElement>();
const { setOptions } = useECharts(chartRef);

const chartLabels = computed(() => ({
  tooltipFailureRate: t('authorizationInvalidation.statsTrendTooltipFailureRate'),
  tooltipTotal: t('authorizationInvalidation.statsTrendTooltipTotal'),
  tooltipFailed: t('authorizationInvalidation.statsTrendTooltipFailed'),
  tooltipDead: t('authorizationInvalidation.statsTrendTooltipDead'),
  yAxis: t('authorizationInvalidation.statsTrendYAxis'),
}));

/**
 * 拉取失败率趋势
 */
async function reloadTrend() {
  trendLoading.value = true;
  try {
    trend.value = await getAuthorizationInvalidationFailureRateTrend({
      granularity: granularity.value,
      days: trendDays.value,
    });
    renderChart();
  } catch (error: unknown) {
    errorMessage(error);
  } finally {
    trendLoading.value = false;
  }
}

/**
 * 渲染折线图
 */
function renderChart() {
  const points = trend.value?.points ?? [];
  setOptions({
    tooltip: {
      trigger: 'axis',
      formatter: (params: unknown) => {
        const { dataIndex } = (params as Array<{ dataIndex: number }>)[0];
        const point = points[dataIndex];
        if (!point) {
          return '';
        }
        return [
          point.bucket ?? '',
          `${chartLabels.value.tooltipFailureRate}: ${Number(point.failureRatePercent).toFixed(2)}%`,
          `${chartLabels.value.tooltipTotal}: ${point.totalCount ?? 0}`,
          `${chartLabels.value.tooltipFailed}: ${point.failedCount ?? 0}`,
          `${chartLabels.value.tooltipDead}: ${point.deadCount ?? 0}`,
        ].join('<br/>');
      },
    },
    grid: { left: 48, right: 24, top: 24, bottom: 48 },
    xAxis: { type: 'category', boundaryGap: false, data: points.map((point) => point.bucket ?? '') },
    yAxis: { type: 'value', min: 0, max: 100, name: chartLabels.value.yAxis, axisLabel: { formatter: '{value}%' } },
    series: [
      {
        type: 'line',
        smooth: true,
        showSymbol: points.length <= 31,
        data: points.map((point) => Number(point.failureRatePercent)),
      },
    ],
  });
}

watch([granularity, trendDays], () => {
  void reloadTrend();
});

watch(chartLabels, () => {
  renderChart();
});

onMounted(() => {
  void reloadTrend();
});

defineExpose({
  reloadTrend,
  trendLoading,
});
</script>

<template>
  <el-card v-loading="trendLoading" class="mb-4" shadow="never">
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <span>{{ t('authorizationInvalidation.statsTrendSection') }}</span>
        <div class="flex flex-wrap items-center gap-3">
          <el-radio-group v-model="granularity" size="small">
            <el-radio-button value="DAY">
              {{ t('authorizationInvalidation.statsTrendGranularityDay') }}
            </el-radio-button>
            <el-radio-button value="WEEK">
              {{ t('authorizationInvalidation.statsTrendGranularityWeek') }}
            </el-radio-button>
          </el-radio-group>

          <el-radio-group v-model="trendDays" size="small">
            <el-radio-button :value="7">{{ t('authorizationInvalidation.statsTrendRange7Days') }}</el-radio-button>
            <el-radio-button :value="30">{{ t('authorizationInvalidation.statsTrendRange30Days') }}</el-radio-button>
            <el-radio-button :value="60">{{ t('authorizationInvalidation.statsTrendRange60Days') }}</el-radio-button>
            <el-radio-button :value="90">{{ t('authorizationInvalidation.statsTrendRange90Days') }}</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </template>

    <div ref="chartRef" class="h-80 w-full" />
  </el-card>
</template>
