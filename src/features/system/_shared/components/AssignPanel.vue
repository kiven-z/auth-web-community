<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'AssignPanel' });

const selectedKeys = defineModel<string[]>({ required: true });

const props = withDefaults(
  defineProps<{
    labels: Record<string, string>;
    leftTitle?: string;
    leftSubtitle?: string;
    sectionLabel?: string;
    leftSpan?: number;
    saving?: boolean;
  }>(),
  {
    leftSpan: 8,
    saving: false,
  }
);

const { t } = useI18n();

const assignedItems = computed(() => selectedKeys.value.map((key) => ({ key, label: props.labels[key] ?? key })));
const hasSelection = computed(() => selectedKeys.value.length > 0);

/**
 * 移除已选 key
 * @param key 行 key
 */
function removeKey(key: string) {
  selectedKeys.value = selectedKeys.value.filter((item) => item !== key);
}

/**
 * 清空已选
 */
function clearAll() {
  selectedKeys.value = [];
}
</script>

<template>
  <el-row :gutter="16" class="assign-panel">
    <el-col :span="leftSpan" class="assign-panel__selected">
      <el-card class="assign-panel__card" shadow="never">
        <template #header>
          <div class="assign-panel__header">
            <div v-if="leftTitle" class="assign-panel__title">
              {{ leftTitle }}
            </div>
            <el-text v-if="leftSubtitle" class="assign-panel__subtitle" type="info">
              {{ leftSubtitle }}
            </el-text>
          </div>
        </template>

        <div class="assign-panel__toolbar">
          <el-text v-if="sectionLabel" class="assign-panel__section-label" type="info">
            <el-badge :max="999" :offset="[6, -6]" :value="assignedItems.length" type="primary">
              {{ sectionLabel }}
            </el-badge>
          </el-text>

          <el-button
            :disabled="saving || !hasSelection"
            class="assign-panel__clear"
            link
            type="danger"
            @click="clearAll()"
          >
            {{ t('buttons.assignClearAll') }}
          </el-button>
        </div>

        <el-scrollbar v-if="hasSelection" class="assign-panel__list">
          <div class="assign-panel__tags">
            <el-tooltip
              v-for="item in assignedItems"
              :key="item.key"
              :content="item.label"
              :show-after="400"
              placement="top"
            >
              <div class="assign-panel__tag-item">
                <el-tag
                  :closable="!saving"
                  class="assign-panel__tag"
                  effect="light"
                  type="success"
                  @close="removeKey(item.key)"
                >
                  <span class="assign-panel__tag-text">{{ item.label }}</span>
                </el-tag>
              </div>
            </el-tooltip>
          </div>
        </el-scrollbar>

        <div v-else class="assign-panel__empty">
          <el-text type="info">
            {{ t('tips.assignEmptySelected') }}
          </el-text>
        </div>
      </el-card>
    </el-col>

    <el-col :span="24 - leftSpan" class="assign-panel__content">
      <slot />
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.assign-panel {
  height: 100%;
  min-height: 0;
  overflow: hidden;

  &__selected,
  &__content {
    display: flex;
    flex-direction: column;
    min-width: 0;
    height: 100%;
    min-height: 0;
    overflow: hidden;
  }

  &__card {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    overflow: hidden;

    :deep(.el-card__header) {
      flex-shrink: 0;
    }

    :deep(.el-card__body) {
      display: flex;
      flex: 1;
      flex-direction: column;
      min-height: 0;
      overflow: hidden;
    }
  }

  &__header {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__title {
    font-weight: 600;
  }

  &__toolbar {
    display: flex;
    flex-shrink: 0;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  &__section-label {
    font-size: 12px;
    font-weight: 600;
  }

  &__list {
    flex: 1 1 0;
    min-height: 0;
  }

  &__tags {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 4px;
  }

  &__tag-item {
    min-width: 0;
  }

  &__tag {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-width: 0;
    max-width: 100%;

    :deep(.el-tag__content) {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-align: left;
    }
  }

  &__tag-text {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__empty {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    min-height: 0;
    padding: 32px 0;
  }

  &__content {
    gap: var(--auth-size-3);
  }
}
</style>
