<script lang="ts" setup>
import { getInAppSendTaskById, type InAppSendTaskDetailVO } from '@/features/message/api/in-app-message';
import TypedContentView, { type TypedContentTypeCode } from '@/components/ui/typed-content-view';
import type { ColumnProps } from '@/components/ui/description';
import ReDescription from '@/components/ui/description';
import { errorMessage } from '@/services/feedback/message';
import { computed, onMounted, ref } from 'vue';

defineOptions({
  name: 'InAppSendTaskDetailView',
});

/** 站内信发送任务详情：元数据 + 定稿正文预览 */
interface InAppSendTaskDetailViewProps {
  /** 任务 ID */
  taskId: string;
  /** 描述列由父组件传入 */
  columns: ColumnProps[];
  /** 正文区块标题 */
  contentLabel: string;
}

const props = defineProps<InAppSendTaskDetailViewProps>();

const loading = ref(false);
const detail = ref<InAppSendTaskDetailVO | null>(null);

/** 预览类型，缺省 TEXT */
const previewContentType = computed(() => (detail.value?.contentType ?? 'TEXT') as TypedContentTypeCode);

/**
 * 拉取发送任务详情
 */
async function load(): Promise<void> {
  try {
    loading.value = true;
    detail.value = await getInAppSendTaskById(props.taskId);
  } catch (error: unknown) {
    errorMessage(error);
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div v-loading="loading">
    <ReDescription :column="2" :columns="columns" :data="detail ?? {}" border />

    <!-- 定稿正文按 contentType 预览；弹窗内限高由调用方负责 -->
    <div class="mb-2 mt-4 text-sm font-medium">{{ contentLabel }}</div>

    <div class="max-h-105 overflow-auto">
      <TypedContentView :content="detail?.content ?? ''" :content-type="previewContentType" />
    </div>
  </div>
</template>
