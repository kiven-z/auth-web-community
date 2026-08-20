<script lang="ts" setup>
import { useInAppInboxStore } from '@/store/modules/message/inAppInbox';
import { useOpenPersonalWorkspace } from '@/features/home/personal/hooks/useOpenPersonalWorkspace';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import BellIcon from '~icons/ep/bell';

defineOptions({
  name: 'LayNotice',
});

const { t } = useI18n();
const { openPersonalWorkspace } = useOpenPersonalWorkspace();
const inboxStore = useInAppInboxStore();
const { totalUnreadCount } = storeToRefs(inboxStore);

onMounted(() => {
  inboxStore.refreshUnreadCount();
});
</script>

<template>
  <span
    :class="['notice-badge', 'navbar-bg-hover', 'select-none', totalUnreadCount > 0 && 'mr-2.5']"
    :title="t('inAppInbox.badgeTitle')"
    @click="openPersonalWorkspace('PersonalInbox')"
  >
    <el-badge
      :class="totalUnreadCount > 0 && 'animate__animated animate__tada animate__infinite'"
      :hidden="totalUnreadCount <= 0"
      :value="totalUnreadCount"
    >
      <span class="notice-badge__icon">
        <IconifyIconOffline :icon="BellIcon" />
      </span>
    </el-badge>
  </span>
</template>

<style lang="scss" scoped>
.notice-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 48px;
  cursor: pointer;

  &__icon {
    font-size: 18px;
  }
}
</style>
