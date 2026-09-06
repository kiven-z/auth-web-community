<script lang="ts" setup>
import { type EmailTemplateRequireFieldRow, renderEmailTemplate } from '@/features/message/api/email-template';
import { copyToClipboard } from '@/shared/utils/clipboard';
import debounce from 'lodash/debounce';
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

defineOptions({
  name: 'EmailTemplateLivePreview',
});

const props = withDefaults(
  defineProps<{
    /** 模板正文 */
    content?: string;
    /** 变量声明（含示例值，用于离线渲染） */
    requireFields?: EmailTemplateRequireFieldRow[];
  }>(),
  {
    content: '',
    requireFields: () => [],
  }
);

const renderedHtml = ref('');
const previewFrameRef = ref<HTMLIFrameElement | null>(null);

const scheduleRender = debounce(async () => {
  try {
    renderedHtml.value = await renderEmailTemplate({
      content: props.content,
      requireFields: props.requireFields ?? [],
    });
  } catch {
    renderedHtml.value = '';
  }
}, 400);

/**
 * 复制当前渲染 HTML
 */
async function copyRenderedHtml() {
  await copyToClipboard(renderedHtml.value);
}

watch(
  () => [props.content, props.requireFields] as const,
  () => {
    scheduleRender();
  },
  { deep: true }
);

watch(
  () => renderedHtml.value,
  async (html) => {
    await nextTick();
    const frame = previewFrameRef.value;
    if (!frame) {
      return;
    }
    frame.srcdoc = html;
  },
  { immediate: true }
);

onMounted(() => {
  scheduleRender();
});

onUnmounted(() => {
  scheduleRender.cancel();
});

defineExpose({ copyRenderedHtml, renderedHtml });
</script>

<template>
  <div class="overflow-auto border p-3">
    <iframe
      ref="previewFrameRef"
      class="min-h-[72vh] w-full border-0"
      sandbox="allow-scripts"
      title="email-template-live-preview"
    />
  </div>
</template>
