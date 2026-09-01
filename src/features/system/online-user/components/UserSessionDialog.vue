<script lang="ts" setup>
import DataTable from '@/components/table/data-table';
import useUserSessionTableColumns from '@/features/system/_shared/columns/use-user-session-table-columns';
import { SYS_SESSION_PERMS } from '@/features/system/_shared/constants/session-permissions';
import { useAdminUserSessions } from '@/features/system/_shared/hooks/use-admin-user-sessions';
import type { KickAllForUserOptions } from '@/features/system/_shared/types';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  userId: string;
  username: string;
  kickAllForUser: (userId: string, options?: KickAllForUserOptions) => void | Promise<void>;
}>();

const { t } = useI18n();
const { columns } = useUserSessionTableColumns();
const { loading, sessions, kickingSessionId, loadSessions, kickSession } = useAdminUserSessions(() => props.userId);
const kickingAll = ref(false);

/**
 * 踢出该用户全部会话并刷新列表
 */
async function handleKickAllSessions() {
  kickingAll.value = true;
  try {
    await props.kickAllForUser(props.userId, {
      successI18nKey: 'users.session.kickAllSuccess',
      onSuccess: loadSessions,
    });
  } finally {
    kickingAll.value = false;
  }
}

onMounted(() => {
  loadSessions();
});
</script>

<template>
  <div class="user-session-dialog">
    <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
      <el-text type="info">
        {{ t('users.session.subtitle', { username }) }}
      </el-text>

      <div class="flex flex-wrap items-center gap-2">
        <el-button
          v-auth="SYS_SESSION_PERMS.KICK_ALL"
          :disabled="sessions.length <= 0"
          :loading="kickingAll"
          link
          type="danger"
          @click="handleKickAllSessions"
        >
          {{ t('users.session.kickAll') }}
        </el-button>
        <el-button
          v-auth="SYS_SESSION_PERMS.VIEW_SESSIONS"
          :loading="loading"
          link
          type="primary"
          @click="loadSessions"
        >
          {{ t('listTable.refresh') }}
        </el-button>
      </div>
    </div>

    <el-empty v-if="!loading && sessions.length <= 0" :description="t('users.session.empty')" />

    <DataTable v-else :columns="columns" :data="sessions" :loading="loading" border row-key="sessionId" size="small">
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
