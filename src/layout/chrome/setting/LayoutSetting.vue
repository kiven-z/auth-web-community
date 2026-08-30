<script lang="ts" setup>
import { useDisplayPreferencesStore } from '@/store/modules/preferences/displayPreferences';
import { useLayoutPreferencesStore } from '@/store/modules/preferences/layoutPreferences';
import { onMounted } from 'vue';
import SettingPanel from '../SettingPanel.vue';
import SettingsLayoutMode from './components/SettingsLayoutMode.vue';
import SettingsOverallStyle from './components/SettingsOverallStyle.vue';
import SettingsTagsStyle from './components/SettingsTagsStyle.vue';
import SettingsToggles from './components/SettingsToggles.vue';

defineOptions({
  name: 'LayoutSetting',
});

const displayStore = useDisplayPreferencesStore();
const layoutStore = useLayoutPreferencesStore();

onMounted(() => {
  displayStore.$applyToDom();
  layoutStore.$applyToShell();
});
</script>

<template>
  <SettingPanel>
    <div class="settings-panel__body">
      <SettingsOverallStyle />
      <SettingsLayoutMode />
      <SettingsTagsStyle />
      <SettingsToggles />
    </div>
  </SettingPanel>
</template>

<style lang="scss" scoped>
.settings-panel__body {
  padding: 20px;
}

:deep(.settings-panel__title) {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--auth-text-primary);
}

:deep(.settings-panel__title--spaced) {
  margin-top: 20px;
}

:deep(.settings-panel__title--spaced-sm) {
  margin-top: 16px;
}

:deep(.el-divider__text) {
  font-size: 16px;
  font-weight: 700;
}
</style>
