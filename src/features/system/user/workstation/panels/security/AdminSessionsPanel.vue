<script lang="ts" setup>
import DataTable from '@/components/table/data-table';
import useUserSessionTableColumns from '@/features/system/_shared/columns/use-user-session-table-columns';
import { SYS_SESSION_PERMS } from '@/features/system/_shared/constants/session-permissions';
import { useAdminUserSessions } from '@/features/system/_shared/hooks/use-admin-user-sessions';
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'AdminSessionsPanel',
});

const props = defineProps<{
  /** 目标用户 ID */
  userId: string;
  /** 目标用户名（字幕展示） */
  username: string;
}>();

const { t } = useI18n();
const { columns } = useUserSessionTableColumns();
const { loading, sessions, kickingSessionId, loadSessions, kickSession } = useAdminUserSessions(() => props.userId);

const subtitle = computed(() => t('users.session.subtitle', { username: props.username || '—' }));

watch(
  () => props.userId,
  () => void loadSessions(),
  { immediate: true }
);

defineExpose({ loadSessions });
</script>

<template>
  <div v-loading="loading" class="admin-sessions-panel">
    <div class="admin-sessions-panel__toolbar">
      <el-text type="info">{{ subtitle }}</el-text>
      <el-button v-auth="SYS_SESSION_PERMS.VIEW_SESSIONS" :loading="loading" link type="primary" @click="loadSessions">
        {{ t('listTable.refresh') }}
      </el-button>
    </div>

    <el-empty v-if="!loading && sessions.length <= 0" :description="t('users.session.empty')" />
    <DataTable v-else :columns="columns" :data="sessions" border row-key="sessionId">
      <template #actions="{ row }">
        <el-button
          v-auth="SYS_SESSION_PERMS.KICK_SESSION"
          :loading="kickingSessionId === row.sessionId"
          link
          type="danger"
          @click="kickSession(row.sessionId)"
        >
          {{ t('users.session.kickOne') }}
        </el-button>
      </template>
    </DataTable>
  </div>
</template>

<style lang="scss" scoped>
.admin-sessions-panel {
  &__toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
}
</style>
