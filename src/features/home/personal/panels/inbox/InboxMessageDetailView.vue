<script lang="ts" setup>
import { getInAppInboxDetail, type InAppInboxDetail } from '@/features/message/api/inAppInbox';
import type { TypedContentTypeCode } from '@/components/ui/TypedContentView';
import TypedContentView from '@/components/ui/TypedContentView';
import { errorMessage } from '@/services/feedback/message';
import { formatDateTime } from '@/shared/utils/date/dateTime';
import { isUrl, openLink } from '@/shared/utils/url/url';
import { useInAppInboxStore } from '@/store/modules/message/inAppInbox';
import { ArrowLeft } from '@element-plus/icons-vue';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

defineOptions({
  name: 'PersonalInboxDetail',
});

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const inboxStore = useInAppInboxStore();

const loading = ref(false);
const detail = ref<InAppInboxDetail | null>(null);

/** 路由上的站内信 ID（雪花字符串） */
const messageId = computed(() => String(route.params.id ?? ''));

/** 正文类型，缺省 TEXT */
const contentType = computed(() => {
  return (detail.value?.contentType ?? 'TEXT') as TypedContentTypeCode;
});

const displayCreatedAt = computed(() => formatDateTime(detail.value?.createdAt));

function openMessageLink(linkUrl: string): void {
  if (isUrl(linkUrl)) {
    openLink(linkUrl);
    return;
  }
  router.push(linkUrl);
}

/**
 * 拉取详情（后端打开即标已读），并刷新未读角标
 */
async function loadDetail(): Promise<void> {
  if (!messageId.value) {
    detail.value = null;
    return;
  }
  try {
    loading.value = true;
    detail.value = await getInAppInboxDetail(messageId.value);
    inboxStore.refreshUnreadCount().catch(() => undefined);
  } catch (error: unknown) {
    errorMessage(error);
    detail.value = null;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadDetail();
});
</script>

<template>
  <div v-loading="loading" class="inbox-message-detail">
    <div class="inbox-message-detail__header">
      <el-button
        :icon="ArrowLeft"
        link
        type="primary"
        @click="router.push({ name: 'PersonalInbox', query: route.query })"
      >
        {{ t('personal.nav.inbox') }}
      </el-button>
    </div>

    <div v-if="detail" class="inbox-message-detail__body">
      <div class="inbox-message-detail__meta">
        <h2 class="inbox-message-detail__title">{{ detail.title }}</h2>
        <div class="inbox-message-detail__sub">
          <span v-if="displayCreatedAt">{{ displayCreatedAt }}</span>
          <span v-if="detail.categoryName">{{ detail.categoryName }}</span>
        </div>
        <el-link
          v-if="detail.linkUrl"
          class="inbox-message-detail__link"
          type="primary"
          @click="openMessageLink(detail.linkUrl)"
        >
          {{ t('inAppInbox.field.linkUrl') }}
        </el-link>
      </div>

      <TypedContentView :content="detail.content" :content-type="contentType" fluid />
    </div>

    <el-empty v-else-if="!loading" :description="t('inAppInbox.empty')" />
  </div>
</template>

<style lang="scss" scoped>
.inbox-message-detail {
  min-height: 100%;

  &__header {
    margin-bottom: 12px;
  }

  &__body {
    width: 100%;
  }

  &__meta {
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  &__title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.4;
  }

  &__sub {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 8px;
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }

  &__link {
    margin-top: 8px;
    font-size: 13px;
  }
}
</style>
