<script lang="ts" setup>
import { useDisplayPreferencesStore } from '@/store/modules/preferences/display-preferences';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = useDisplayPreferencesStore();
const { weak, hideFooter } = storeToRefs(store);
</script>

<template>
  <div>
    <el-divider content-position="left">{{ t('panel.interfaceDisplay') }}</el-divider>
    <ul class="settings-toggles">
      <li>
        <span>{{ t('panel.weakModel') }}</span>
        <el-switch v-model="weak" @change="(value: boolean) => store.setWeak(value)" />
      </li>
      <li>
        <span>{{ t('panel.hiddenFooter') }}</span>
        <el-switch v-model="hideFooter" @change="(value: boolean) => store.setHideFooter(value)" />
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
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
