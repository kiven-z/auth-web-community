<script lang="tsx" setup>
import { kickMySession, listMySessions, type MeUserSession } from '@/features/system/api/user/user-me';
import DataTable from '@/components/table/data-table';
import { errorMessage, message } from '@/services/feedback/message';
import useMeSessionTableColumns from '@/features/home/personal/panels/security/hooks/use-me-session-table-columns';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'ProfileSessionsPanel',
});

const props = defineProps<{
  sessions: MeUserSession[];
}>();

const emit = defineEmits<{
  'update:sessions': [sessions: MeUserSession[]];
}>();

const { t } = useI18n();
const { meSessionTableColumns } = useMeSessionTableColumns();
const revokingSessionId = ref<string | null>(null);

const sessionList = computed(() => props.sessions);

/**
 * 下线指定会话并刷新列表
 * @param sessionId 会话 ID
 */
async function handleRevokeSession(sessionId: string) {
  revokingSessionId.value = sessionId;
  try {
    await kickMySession(sessionId);
    message(t('account.message.revokeSuccess'), { type: 'success' });
    emit('update:sessions', await listMySessions());
  } catch (error: unknown) {
    errorMessage(error);
  } finally {
    revokingSessionId.value = null;
  }
}
</script>

<template>
  <div class="profile-sessions-panel">
    <el-text class="profile-sessions-panel__subtitle" type="info">{{ t('account.session.subtitle') }}</el-text>

    <el-empty v-if="sessionList.length <= 0" :description="t('users.session.empty')" />
    <DataTable
      v-else
      :columns="meSessionTableColumns"
      :data="sessionList"
      :row-class-name="({ row }) => (row.current ? 'session-row--current' : '')"
      border
      row-key="sessionId"
    >
      <template #actions="{ row }">
        <el-button
          v-if="!row.current"
          :loading="revokingSessionId === row.sessionId"
          link
          type="danger"
          @click="handleRevokeSession(row.sessionId)"
        >
          {{ t('account.session.revoke') }}
        </el-button>
      </template>
    </DataTable>
  </div>
</template>

<style lang="scss" scoped>
.profile-sessions-panel {
  &__subtitle {
    display: block;
    margin-bottom: 12px;
  }

  :deep(.session-row--current) {
    background-color: var(--el-color-primary-light-9);

    td {
      background-color: var(--el-color-primary-light-9) !important;
    }
  }
}
</style>
