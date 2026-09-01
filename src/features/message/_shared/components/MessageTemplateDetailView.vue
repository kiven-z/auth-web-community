<script lang="ts" setup>
import type { MessageChannelCode } from '@/features/message/api/models/message-template';
import type { MessageTemplateDetailVO } from '@/features/message/api/message-template';
import { getMessageTemplateById } from '@/features/message/api/message-template';
import type { TypedContentTypeCode } from '@/components/ui/typed-content-view';
import TypedContentView from '@/components/ui/typed-content-view';
import type { ColumnProps } from '@/components/ui/description';
import ReDescription from '@/components/ui/description';
import { errorMessage } from '@/services/feedback/message';
import { formatDateTime } from '@/shared/utils/date/date-time';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'MessageTemplateDetailView',
});

/** 跨渠道消息模板详情：一次拉详情，Tab 切换渲染结果与原文 */
interface MessageTemplateDetailViewProps {
  id: string;
  channel: MessageChannelCode;
  /** 渠道差异：描述列由父组件传入 */
  columns: ColumnProps[];
  /** 正文区块标题 */
  contentLabel: string;
}

const props = defineProps<MessageTemplateDetailViewProps>();

const { t } = useI18n();

const loading = ref(false);
const detail = ref<MessageTemplateDetailVO | null>(null);
const contentTab = ref<'preview' | 'source'>('preview');

/** 预览类型，缺省 TEXT */
const previewContentType = computed(() => {
  return (detail.value?.contentType ?? 'TEXT') as TypedContentTypeCode;
});

/** 标题下方展示的时间 */
const displayCreatedAt = computed(() => formatDateTime(detail.value?.createdAt));

/** 拉取详情 */
const load = async () => {
  try {
    loading.value = true;
    detail.value = await getMessageTemplateById(props.id, props.channel);
  } catch (error: unknown) {
    errorMessage(error);
  } finally {
    loading.value = false;
  }
};

onMounted(load);
</script>

<template>
  <div v-loading="loading" class="message-template-detail">
    <ReDescription :column="2" :columns="columns" :data="detail ?? {}" border />

    <!-- 正文：渲染结果 / 原文 -->
    <div class="message-template-detail__content-label">{{ contentLabel }}</div>

    <el-tabs v-model="contentTab">
      <!-- 按示例值渲染后的效果 -->
      <el-tab-pane :label="t('messageTemplate.previewTab')" lazy name="preview">
        <el-alert
          :closable="false"
          :title="t('messageTemplate.previewTips')"
          class="message-template-detail__alert"
          type="info"
        />
        <div class="message-template-detail__letter">
          <div class="message-template-detail__letter-header">
            <h2 v-if="detail?.previewSubject">{{ detail.previewSubject }}</h2>
            <div>{{ displayCreatedAt }}</div>
          </div>
          <!-- 弹窗内限高由调用方负责 -->
          <div class="max-h-105 overflow-auto">
            <TypedContentView :content="detail?.previewContent ?? ''" :content-type="previewContentType" />
          </div>
        </div>
      </el-tab-pane>

      <!-- FreeMarker 原文，固定纯文本展示 -->
      <el-tab-pane :label="t('messageTemplate.sourceTab')" lazy name="source">
        <div class="message-template-detail__letter">
          <div class="message-template-detail__letter-header">
            <h2 v-if="detail?.subject">{{ detail.subject }}</h2>
            <div>{{ displayCreatedAt }}</div>
          </div>
          <div class="max-h-105 overflow-auto">
            <TypedContentView :content="detail?.content ?? ''" content-type="TEXT" />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.message-template-detail {
  &__content-label {
    margin: 16px 0 8px;
    font-size: 14px;
    font-weight: 500;
  }

  &__alert {
    margin-bottom: 12px;
  }

  &__letter {
    margin-top: 8px;
  }

  &__letter-header {
    padding-bottom: 16px;
    margin-bottom: 16px;
    text-align: center;
    border-bottom: 1px solid var(--el-border-color-lighter);

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }

    div {
      margin-top: 8px;
      font-size: 13px;
      color: var(--el-text-color-secondary);
    }
  }
}
</style>
