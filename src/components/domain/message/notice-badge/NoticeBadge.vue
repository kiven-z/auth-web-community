<script lang="ts" setup>
import { useInAppInboxStore } from '@/store/modules/message/in-app-inbox';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import BellIcon from '~icons/ri/notification-3-line';

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
  <span class="layout-toolbar__item" :title="t('inAppInbox.badgeTitle')" @click="$emit('click')">
    <el-badge
      :class="totalUnreadCount > 0 && 'animate__animated animate__tada animate__infinite'"
      :hidden="totalUnreadCount <= 0"
      :value="totalUnreadCount"
    >
      <BellIcon />
    </el-badge>
  </span>
</template>
