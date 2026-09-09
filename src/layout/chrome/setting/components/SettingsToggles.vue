<script lang="ts" setup>
import { useDisplayPreferencesStore } from '@/store/modules/preferences/display-preferences';
import { useTagsPreferencesStore } from '@/store/modules/preferences/tags/tags-preferences';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = useDisplayPreferencesStore();
const { grey, weak, hideTabs, hideFooter, showLogo } = storeToRefs(store);

const tagsStore = useTagsPreferencesStore();
const { enabled: tagsEnabled } = storeToRefs(tagsStore);
</script>

<template>
  <div>
    <p class="settings-panel__title settings-panel__title--spaced">
      {{ t('panel.interfaceDisplay') }}
    </p>
    <ul class="settings-toggles">
      <li>
        <span>{{ t('panel.greyModel') }}</span>
        <el-switch v-model="grey" @change="(value: boolean) => store.setGrey(value)" />
      </li>
      <li>
        <span>{{ t('panel.weakModel') }}</span>
        <el-switch v-model="weak" @change="(value: boolean) => store.setWeak(value)" />
      </li>
      <li>
        <span>{{ t('panel.hiddenTags') }}</span>
        <el-switch v-model="hideTabs" @change="(value: boolean) => store.setHideTabs(value)" />
      </li>
      <li>
        <span>{{ t('panel.hiddenFooter') }}</span>
        <el-switch v-model="hideFooter" @change="(value: boolean) => store.setHideFooter(value)" />
      </li>
      <li>
        <span>Logo</span>
        <el-switch v-model="showLogo" @change="(value: boolean) => store.setShowLogo(value)" />
      </li>
      <li>
        <span>{{ t('panel.multiTagsCache') }}</span>
        <el-switch v-model="tagsEnabled" @change="(value: boolean) => tagsStore.setEnabled(value)" />
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-switch__core) {
  --el-switch-off-color: var(--auth-switch-off-color);

  min-width: 36px;
  height: 18px;
}

:deep(.el-switch__core .el-switch__action) {
  height: 14px;
}

.settings-toggles {
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 3px 0;
    font-size: 14px;
  }
}
</style>
