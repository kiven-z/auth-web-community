<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useLayoutShellRuntimeStore } from '@/store/modules/layoutShellRuntime';
import KeyboardEsc from '~icons/mdi/keyboard-esc';
import EnterOutlined from '~icons/ri/corner-down-left-line';
import ArrowUpLine from '~icons/ri/arrow-up-line';
import ArrowDownLine from '~icons/ri/arrow-down-line';

withDefaults(defineProps<{ total?: number }>(), {
  total: 0,
});

const { t } = useI18n();
const { device } = storeToRefs(useLayoutShellRuntimeStore());
</script>

<template>
  <div class="search-footer">
    <span class="search-footer__item">
      <IconifyIconOffline :icon="EnterOutlined" class="search-footer__icon" />
      {{ t('buttons.confirm') }}
    </span>
    <span class="search-footer__item">
      <IconifyIconOffline :icon="ArrowUpLine" class="search-footer__icon" />
      <IconifyIconOffline :icon="ArrowDownLine" class="search-footer__icon" />
      {{ t('buttons.switch') }}
    </span>
    <span class="search-footer__item">
      <IconifyIconOffline :icon="KeyboardEsc" class="search-footer__icon" />
      {{ t('buttons.close') }}
    </span>
    <p v-if="device !== 'mobile' && total > 0" class="search-footer__total">
      {{ `${t('search.total')} ${total}` }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.search-footer {
  display: flex;
  color: var(--auth-text-primary);
}

.search-footer__item {
  display: flex;
  align-items: center;
  margin-right: 14px;
  color: var(--auth-text-secondary);
}

.search-footer__icon {
  padding: 2px;
  margin-right: 3px;
  font-size: 20px;
  box-shadow:
    inset 0 -2px var(--auth-color-border),
    inset 0 0 1px 1px var(--auth-bg-container),
    0 1px 2px 1px color-mix(in srgb, var(--auth-color-gray-12) 40%, transparent);
}

.search-footer__total {
  position: absolute;
  right: 20px;
}
</style>
