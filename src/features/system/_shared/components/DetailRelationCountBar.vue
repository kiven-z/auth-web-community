<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { DetailRelationCountBarProps } from '@/features/system/_shared/types';

defineOptions({
  name: 'DetailRelationCountBar',
});

const props = withDefaults(defineProps<DetailRelationCountBarProps>(), {
  showViewAuthorization: true,
});

const emit = defineEmits<{
  viewAuthorization: [];
}>();

const { t } = useI18n();

const normalizedItems = computed(() =>
  props.items.map((item) => ({
    label: item.label,
    count: Number(item.count ?? 0),
  }))
);
</script>

<template>
  <section class="detail-relation-count-bar">
    <div class="detail-relation-count-bar__header">
      <span class="detail-relation-count-bar__title">{{ t('authorization.relationTitle') }}</span>
      <el-button v-if="showViewAuthorization" link type="primary" @click="emit('viewAuthorization')">
        {{ t('authorization.view') }}
      </el-button>
    </div>

    <ul class="detail-relation-count-bar__items">
      <li v-for="item in normalizedItems" :key="item.label" class="detail-relation-count-bar__item">
        <span class="detail-relation-count-bar__label">{{ item.label }}</span>
        <span class="detail-relation-count-bar__value">{{ item.count }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.detail-relation-count-bar__header {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.detail-relation-count-bar__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.detail-relation-count-bar__items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.detail-relation-count-bar__item {
  display: inline-flex;
  gap: 8px;
  align-items: baseline;
  cursor: default;
  user-select: none;
}

.detail-relation-count-bar__label {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.detail-relation-count-bar__value {
  font-size: 16px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--el-text-color-primary);
}
</style>
