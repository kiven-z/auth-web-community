<script lang="ts" setup>
import { multiConfirm } from '@/services/feedback/dialog';
import { useUserStore } from '@/store/modules/auth/user';
import { useI18n } from 'vue-i18n';
import SettingsLayoutMode from './components/SettingsLayoutMode.vue';
import SettingsOverallStyle from './components/SettingsOverallStyle.vue';
import SettingsToggles from './components/SettingsToggles.vue';

defineOptions({
  name: 'PersonalAppearancePanel',
});

const { t } = useI18n();
const userStore = useUserStore();

/** 确认后退出登录，并清空本机本地数据 */
async function handleClearCache() {
  const confirmed = await multiConfirm([
    { title: t('panel.clearCacheConfirmTitle'), message: t('panel.clearCacheConfirm') },
  ]);
  if (!confirmed) {
    return;
  }
  await userStore.logoutAndClear();
}
</script>

<template>
  <div>
    <SettingsOverallStyle />
    <SettingsLayoutMode />
    <SettingsToggles />

    <el-button type="danger" class="mt-5! w-full" @click="handleClearCache">
      {{ t('panel.clearCache') }}
    </el-button>
  </div>
</template>
