import { useDark } from '@/shared/composables/theme/useDark';
import { computed, type ComputedRef, type Ref } from 'vue';

/** 编辑器主题（与应用明暗一致） */
interface EditorTheme {
  /** 应用是否为暗色 */
  isDark: Ref<boolean>;
  /** md-editor-v3：`dark` | `light` */
  mdEditorTheme: ComputedRef<'dark' | 'light'>;
  /** Monaco：`vs-dark` | `vs` */
  monacoTheme: ComputedRef<'vs-dark' | 'vs'>;
}

/**
 * 统一导出 md-editor / Monaco 等共用明暗状态
 * @returns 编辑器主题
 */
export function useEditorTheme(): EditorTheme {
  const { isDark } = useDark();

  return {
    isDark,
    mdEditorTheme: computed(() => (isDark.value ? 'dark' : 'light')),
    monacoTheme: computed(() => (isDark.value ? 'vs-dark' : 'vs')),
  };
}
