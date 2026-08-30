<script lang="tsx" setup>
import type { DeptClosureHealth } from '@/features/system/api/dept/deptClosure';
import { getDeptClosureHealth } from '@/features/system/api/dept/deptClosure';
import Description from '@/components/ui/Description';
import { errorMessage } from '@/services/feedback/message';
import useDeptClosureHealthColumns from '@/features/system/dept/hooks/columns/useDeptClosureHealthColumns';
import { ElAlert, ElDivider } from 'element-plus';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'DeptClosureHealthDialog',
});

const { t } = useI18n();

const loading = ref(false);
const data = ref<DeptClosureHealth | null>(null);

const { summaryColumns, healthStatsColumns, parentLinkColumns, depthChainColumns } = useDeptClosureHealthColumns();

/**
 * 拉取闭包健康检查结果
 */
async function reload() {
  loading.value = true;
  try {
    data.value = await getDeptClosureHealth();
  } catch (error: unknown) {
    errorMessage(error);
  } finally {
    loading.value = false;
  }
}

/** 检查摘要（单条） */
const summaryData = computed(() => {
  const health = data.value;
  if (!health) {
    return {};
  }
  return {
    passed: health.passed,
    checkedAt: health.checkedAt,
    missingParentLinkCount: health.missingParentLinkCount,
    depthChainAnomalyCount: health.depthChainAnomalyCount,
    parentLinkSampleTruncated: health.parentLinkSampleTruncated,
    depthChainSampleTruncated: health.depthChainSampleTruncated,
  };
});

/** 健康度统计（单条） */
const healthStatsData = computed(() => data.value?.healthStats ?? {});

onMounted(() => {
  reload();
});

defineExpose({ reload });
</script>

<template>
  <div v-loading="loading" class="min-h-40">
    <el-alert
      :title="data?.passed ? t('dept.closureHealth.alert.pass') : t('dept.closureHealth.alert.fail')"
      :type="data?.passed ? 'success' : 'error'"
      class="mb-2!"
      closable
      show-icon
    />

    <template v-if="data">
      <Description :column="2" :columns="summaryColumns" :data="summaryData" :title="t('dept.closureHealth.summary')" />

      <el-divider />

      <Description
        :column="2"
        :columns="healthStatsColumns"
        :data="healthStatsData"
        :title="t('dept.closureHealth.statsTitle')"
      />

      <el-divider />

      <Description
        :column="2"
        :columns="parentLinkColumns"
        :data="data.parentLinkAnomalies"
        :title="t('dept.closureHealth.parentLinkTitle')"
      />
      <el-text v-if="data.parentLinkAnomalies.length === 0" class="mb-4" type="info">
        {{ t('dept.closureHealth.anomalyEmpty') }}
      </el-text>

      <el-divider />

      <Description
        :column="2"
        :columns="depthChainColumns"
        :data="data.depthChainAnomalies"
        :title="t('dept.closureHealth.depthChainTitle')"
      />
      <el-text v-if="data.depthChainAnomalies.length === 0" type="info">
        {{ t('dept.closureHealth.anomalyEmpty') }}
      </el-text>
    </template>
  </div>
</template>
