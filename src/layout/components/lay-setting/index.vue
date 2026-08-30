<script lang="ts" setup>
import { applyThemePreferences } from '@/core/preferences/runtime/apply';
import { useUiLayout } from '@/layout/hooks/layout/useUiLayout';
import { useUiTheme } from '@/layout/hooks/theme/useUiTheme';
import { toLayoutMode } from '@/shared/utils/layout/layout-mode';
import { unref } from 'vue';
import LayPanel from '../lay-panel/index.vue';
import SettingsLayoutMode from './SettingsLayoutMode.vue';
import SettingsOverallStyle from './SettingsOverallStyle.vue';
import SettingsTagsStyle from './SettingsTagsStyle.vue';
import SettingsToggles from './SettingsToggles.vue';

defineOptions({
  name: 'LaySetting',
});

const { setLayoutMode } = useUiLayout();
const { layoutTheme } = useUiTheme();

/* 初始化布局与主题 */
if (unref(layoutTheme)) {
  const layoutMode = toLayoutMode(unref(layoutTheme).layout);
  setLayoutMode(layoutMode);
  applyThemePreferences();
}
</script>

<template>
  <LayPanel>
    <div class="p-5">
      <SettingsOverallStyle />
      <SettingsLayoutMode />
      <SettingsTagsStyle />
      <SettingsToggles />
    </div>
  </LayPanel>
</template>

<style lang="scss" scoped>
:deep(.el-divider__text) {
  font-size: 16px;
  font-weight: 700;
}
</style>
