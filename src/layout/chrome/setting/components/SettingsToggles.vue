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
      <li class="settings-toggles__item">
        <span class="settings-toggles__label">{{ t('panel.greyModel') }}</span>
        <el-switch
          v-model="grey"
          :active-text="t('buttons.switchOnText')"
          :inactive-text="t('buttons.switchOffText')"
          inline-prompt
          @change="(value: boolean) => store.setGrey(value)"
        />
      </li>
      <li class="settings-toggles__item">
        <span class="settings-toggles__label">{{ t('panel.weakModel') }}</span>
        <el-switch
          v-model="weak"
          :active-text="t('buttons.switchOnText')"
          :inactive-text="t('buttons.switchOffText')"
          inline-prompt
          @change="(value: boolean) => store.setWeak(value)"
        />
      </li>
      <li class="settings-toggles__item">
        <span class="settings-toggles__label">{{ t('panel.hiddenTags') }}</span>
        <el-switch
          v-model="hideTabs"
          :active-text="t('buttons.switchOnText')"
          :inactive-text="t('buttons.switchOffText')"
          inline-prompt
          @change="(value: boolean) => store.setHideTabs(value)"
        />
      </li>
      <li class="settings-toggles__item">
        <span class="settings-toggles__label">{{ t('panel.hiddenFooter') }}</span>
        <el-switch
          v-model="hideFooter"
          :active-text="t('buttons.switchOnText')"
          :inactive-text="t('buttons.switchOffText')"
          inline-prompt
          @change="(value: boolean) => store.setHideFooter(value)"
        />
      </li>
      <li class="settings-toggles__item">
        <span class="settings-toggles__label">Logo</span>
        <el-switch
          v-model="showLogo"
          :active-text="t('buttons.switchOnText')"
          :inactive-text="t('buttons.switchOffText')"
          inline-prompt
          @change="(value: boolean) => store.setShowLogo(value)"
        />
      </li>
      <li class="settings-toggles__item">
        <span class="settings-toggles__label">{{ t('panel.multiTagsCache') }}</span>
        <el-switch
          v-model="tagsEnabled"
          :active-text="t('buttons.switchOnText')"
          :inactive-text="t('buttons.switchOffText')"
          inline-prompt
          @change="(value: boolean) => tagsStore.setEnabled(value)"
        />
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
  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 3px 0;
    font-size: 14px;
  }

  &__label {
    color: var(--auth-text-primary);
  }
}
</style>
