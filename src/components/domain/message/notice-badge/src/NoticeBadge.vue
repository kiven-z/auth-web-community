<script lang="ts" setup>
import { useInAppInboxStore } from '@/store/modules/message/in-app-inbox';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import BellIcon from '~icons/ep/bell';

defineOptions({
  name: 'NoticeBadge',
});

defineEmits<{
  click: [];
}>();

const { t } = useI18n();
const inboxStore = useInAppInboxStore();
const { totalUnreadCount } = storeToRefs(inboxStore);

onMounted(() => {
  inboxStore.refreshUnreadCount();
});
</script>

<template>
  <span
    :class="['notice-badge', 'layout-toolbar__hover', totalUnreadCount > 0 && 'notice-badge--unread']"
    :title="t('inAppInbox.badgeTitle')"
    @click="$emit('click')"
  >
    <el-badge
      :class="totalUnreadCount > 0 && 'animate__animated animate__tada animate__infinite'"
      :hidden="totalUnreadCount <= 0"
      :value="totalUnreadCount"
    >
      <span class="notice-badge__icon">
        <BellIcon />
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
  user-select: none;

  &--unread {
    margin-right: 10px;
  }

  &__icon {
    font-size: 18px;
  }
}
</style>
