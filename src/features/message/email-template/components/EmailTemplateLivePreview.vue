<script lang="ts" setup>
import { type EmailTemplateRequireFieldRow, renderEmailTemplate } from '@/features/message/api/email-template';
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
</script>

<template>
  <div class="border p-3 overflow-auto">
    <iframe
      ref="previewFrameRef"
      class="w-full min-h-[62vh] border-0 block"
      sandbox="allow-scripts"
      title="email-template-live-preview"
    />
  </div>
</template>
