<script lang="ts" setup>
import type { EmailTemplateRequireFieldRow } from '@/features/message/api/email-template';
import { useEditorTheme } from '@/shared/composables/editor/useEditorTheme';
import { MONACO_COMMON_EDITOR_OPTIONS } from '@/features/message/email-template/config/monaco-config';
import { registerEmailTemplateMonaco } from '@/features/message/email-template/monaco/register-email-template-monaco';
import type { editor } from 'monaco-editor';
import * as monaco from 'monaco-editor';
import { CodeEditor } from 'monaco-editor-vue3';
import { onUnmounted, toRef } from 'vue';

defineOptions({
  name: 'EmailTemplateContentEditor',
});

const props = withDefaults(
  defineProps<{
    /** 模板正文 */
    value?: string;
    /** 变量声明，驱动 ${} 补全与标红 */
    requireFields?: EmailTemplateRequireFieldRow[];
  }>(),
  {
    value: '',
    requireFields: () => [],
  }
);

const emit = defineEmits<{
  'update:value': [value: string];
}>();

const { monacoTheme } = useEditorTheme();
const requireFieldsRef = toRef(props, 'requireFields');

let disposeMonacoRegistration: (() => void) | null = null;

/**
 * Monaco 就绪后注册变量补全 / 悬浮 / 标红。
 */
const onMonacoReady = (editorInstance: editor.IStandaloneCodeEditor) => {
  disposeMonacoRegistration?.();
  const reg = registerEmailTemplateMonaco(editorInstance, monaco, () => requireFieldsRef.value ?? []);
  disposeMonacoRegistration = reg.dispose;
};

onUnmounted(() => {
  disposeMonacoRegistration?.();
  disposeMonacoRegistration = null;
});
</script>

<template>
  <CodeEditor
    :value="value"
    :options="MONACO_COMMON_EDITOR_OPTIONS"
    :theme="monacoTheme"
    class="min-h-[65vh] border"
    language="html"
    @update:value="emit('update:value', $event)"
    @editor-did-mount="onMonacoReady"
  />
</template>
