<script lang="ts" setup>
import type { InAppInboxPageRow } from '@/features/message/api/in-app-inbox';
import { formatDateTime } from '@/shared/utils/date/date-time';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

defineOptions({
  name: 'InboxMessageList',
});

defineProps<{
  /** 列表数据 */
  rows: InAppInboxPageRow[];
  /** 加载中 */
  loading: boolean;
}>();

const selectedRows = defineModel<string[]>('selectedRows', { required: true });

const emit = defineEmits<{
  'row-delete': [messageId: string];
  'row-mark-read': [messageId: string];
}>();

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

/**
 * 勾选 / 取消勾选单行。
 * @param messageId 消息 ID
 * @param checked 是否选中
 */
const toggleRow = (messageId: string, checked: boolean) => {
  if (checked) {
    selectedRows.value.push(messageId);
    return;
  }
  selectedRows.value = selectedRows.value.filter((id) => id !== messageId);
};
</script>

<template>
  <div v-loading="loading" class="inbox-message-list">
    <el-empty v-if="!loading && rows.length === 0" :description="t('inAppInbox.empty')" />

    <div
      v-for="row in rows"
      :key="row.id"
      :class="{ 'inbox-message-list__row--unread': !row.isRead }"
      class="inbox-message-list__row"
      @click="
        router.push({
          name: 'PersonalInboxDetail',
          params: { id: row.id },
          query: route.query,
        })
      "
    >
      <el-checkbox
        :model-value="selectedRows.includes(row.id!)"
        @change="(checked) => toggleRow(row.id!, Boolean(checked))"
        @click.stop
      />

      <span class="inbox-message-list__category">{{ row.categoryName || '—' }}</span>
      <span class="inbox-message-list__title">{{ row.title }}</span>

      <div class="inbox-message-list__trailing" @click.stop>
        <div class="inbox-message-list__actions">
          <el-button v-if="!row.isRead" link type="primary" @click="emit('row-mark-read', row.id!)">
            {{ t('inAppInbox.action.markRead') }}
          </el-button>
          <el-button link type="danger" @click="emit('row-delete', row.id!)">
            {{ t('buttons.actionDelete') }}
          </el-button>
        </div>
        <div class="inbox-message-list__time">{{ formatDateTime(row.createdAt, 'YYYY-MM-DD HH:mm') }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.inbox-message-list {
  height: 100%;
  padding: 4px 8px 24px 0;
  overflow-y: auto;

  &__row {
    display: grid;
    grid-template-columns: auto minmax(140px, 220px) 1fr auto;
    gap: 16px 24px;
    align-items: center;
    padding: 8px;
    cursor: pointer;
    border-bottom: 1px solid var(--el-border-color-lighter);

    &:hover {
      background: var(--el-fill-color-light);

      .inbox-message-list__actions {
        pointer-events: auto;
        opacity: 1;
      }

      .inbox-message-list__time {
        pointer-events: none;
        opacity: 0;
      }
    }

    &--unread .inbox-message-list__title {
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  &__category,
  &__title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
    color: var(--el-text-color-regular);
    white-space: nowrap;
  }

  &__trailing {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 120px;
    min-height: 24px;
  }

  &__actions {
    position: absolute;
    inset: 0;
    display: flex;
    gap: 4px;
    align-items: center;
    justify-content: flex-end;
    pointer-events: none;
    opacity: 0;
  }

  &__time {
    font-size: 13px;
    color: var(--el-text-color-secondary);
    white-space: nowrap;
  }
}
</style>
