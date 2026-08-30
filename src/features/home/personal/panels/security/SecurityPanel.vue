<script lang="ts" setup>
import { listMySessions, type MeUserSession } from '@/features/system/api/user/userMe';
import { errorMessage } from '@/services/feedback/message';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ProfileSecurityCard from './components/ProfileSecurityCard.vue';
import ProfileSessionsPanel from './components/ProfileSessionsPanel.vue';

defineOptions({
  name: 'PersonalSecurityPanel',
});

const { t } = useI18n();

const loading = ref(false);
const sessions = ref<MeUserSession[]>([]);

/**
 * 拉取活跃会话列表
 */
async function loadSessions() {
  loading.value = true;
  try {
    sessions.value = await listMySessions();
  } catch (error: unknown) {
    errorMessage(error);
    sessions.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadSessions();
});
</script>

<template>
  <div v-loading="loading" class="account-security">
    <section class="account-security__section">
      <el-divider content-position="left">{{ t('account.section.accountActions') }}</el-divider>
      <ProfileSecurityCard />
    </section>

    <section class="account-security__section">
      <el-divider content-position="left">{{ t('account.session.title') }}</el-divider>
      <ProfileSessionsPanel v-model:sessions="sessions" />
    </section>
  </div>
</template>

<style lang="scss" scoped>
.account-security {
  &__section {
    &:not(:last-child) {
      margin-bottom: 24px;
    }
  }
}
</style>
