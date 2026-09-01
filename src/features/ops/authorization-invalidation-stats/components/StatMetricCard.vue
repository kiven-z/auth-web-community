<script lang="ts" setup>
import { Warning } from '@element-plus/icons-vue';
import { computed } from 'vue';
import type { StatMetricCardProps, StatMetricTone } from './stat-metric-types';
import { DEFAULT_STATISTIC_TRANSITION_MS, useAnimatedStatistic } from '../hooks/use-animated-statistic';

defineOptions({
  name: 'StatMetricCard',
});

const props = withDefaults(defineProps<StatMetricCardProps>(), {
  precision: 0,
  suffix: '',
  footer: '',
  tone: 'default',
  clickable: false,
  tooltip: '',
  duration: DEFAULT_STATISTIC_TRANSITION_MS,
});

const emit = defineEmits<{
  click: [];
}>();

const animatedValue = useAnimatedStatistic(() => props.value, props.duration);

const TONE_COLOR: Record<StatMetricTone, string | undefined> = {
  default: undefined,
  primary: 'var(--el-color-primary)',
  success: 'var(--el-color-success)',
  warning: 'var(--el-color-warning)',
  danger: 'var(--el-color-danger)',
  info: 'var(--el-color-info)',
};

const valueStyle = computed(() => {
  const color = TONE_COLOR[props.tone];
  return color ? { color } : undefined;
});

function handleClick() {
  if (!props.clickable) {
    return;
  }
  emit('click');
}
</script>

<template>
  <div :class="{ 'stat-metric-card--clickable': clickable }" class="stat-metric-card" @click="handleClick">
    <el-statistic :precision="precision" :suffix="suffix" :value="animatedValue" :value-style="valueStyle">
      <template #title>
        <div class="stat-metric-card__title">
          <span>{{ title }}</span>
          <el-tooltip v-if="tooltip" :content="tooltip" placement="top">
            <el-icon :size="12" class="stat-metric-card__tip" @click.stop>
              <Warning />
            </el-icon>
          </el-tooltip>
        </div>
      </template>
    </el-statistic>

    <div v-if="footer" class="stat-metric-card__footer">
      {{ footer }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.stat-metric-card {
  height: 100%;
  padding: 16px;
  background-color: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;

  &--clickable {
    cursor: pointer;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    &:hover {
      border-color: var(--el-color-primary-light-5);
      box-shadow: 0 0 0 1px var(--el-color-primary-light-7);
    }
  }

  :deep(.el-statistic) {
    --el-statistic-content-font-size: 26px;
  }

  &__title {
    display: inline-flex;
    gap: 4px;
    align-items: center;
  }

  &__tip {
    color: var(--el-text-color-secondary);
  }

  &__footer {
    margin-top: 12px;
    font-size: 12px;
    color: var(--el-text-color-regular);
  }
}
</style>
