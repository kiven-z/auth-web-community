<script lang="ts" setup>
import { useEditorTheme } from '@/shared/composables/editor/useEditorTheme';
import { MD_PREVIEW_THEME } from '@/shared/constants/mdPreview';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import { nextTick, ref, useId, watch } from 'vue';
import type { TypedContentViewProps } from './types';

defineOptions({
  name: 'TypedContentView',
});

const props = withDefaults(defineProps<TypedContentViewProps>(), {
  content: '',
  fluid: false,
});

const { mdEditorTheme } = useEditorTheme();
const htmlFrameRef = ref<HTMLIFrameElement | null>(null);
const markdownPreviewId = useId();

watch(
  () => [props.contentType, props.content] as const,
  async ([contentType, content]) => {
    if (contentType !== 'HTML') {
      return;
    }
    await nextTick();
    if (htmlFrameRef.value) {
      htmlFrameRef.value.srcdoc = content ?? '';
    }
  },
  { immediate: true }
);
</script>

<template>
  <div :class="fluid ? 'typed-content-view--fluid' : 'p-2'">
    <!-- TEXT：原样纯文本 -->
    <div v-if="contentType === 'TEXT'" class="whitespace-pre-wrap break-all rounded text-left">
      {{ content ?? '' }}
    </div>

    <!-- MARKDOWN：md-editor-v3 预览（Mermaid 由库内异步替换，勿外层 rerender） -->
    <div v-else-if="contentType === 'MARKDOWN'" class="typed-content-view__markdown">
      <MdPreview
        :id="markdownPreviewId"
        :model-value="content ?? ''"
        :preview-theme="MD_PREVIEW_THEME"
        :theme="mdEditorTheme"
      />
    </div>

    <!-- HTML：iframe 沙箱展示（高度由调用方容器控制时仍需 iframe 自身高度） -->
    <div v-else-if="contentType === 'HTML'" class="bg-(--el-fill-color-blank)">
      <iframe
        ref="htmlFrameRef"
        class="block h-105 w-full border-0"
        sandbox="allow-same-origin"
        title="typed-content"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 预览跟页面背景走，不单独铺编辑器画布底色 */
:deep(.md-editor) {
  --md-bk-color: transparent;
  --md-color: var(--el-text-color-primary);
  --md-border-color: transparent;

  width: 100%;
  background-color: transparent;
  border: none;
}

.typed-content-view--fluid {
  width: 100%;
}

.typed-content-view__markdown {
  width: 100%;

  :deep(.md-editor-previewOnly .md-editor-preview) {
    padding: 0;
  }

  :deep(.md-editor-mermaid) {
    overflow-x: auto;
  }
}
</style>
