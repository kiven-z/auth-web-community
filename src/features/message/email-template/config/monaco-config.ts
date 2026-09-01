import type { editor } from 'monaco-editor';

/**
 * FreeMarker 保留关键字，不参与自定义变量匹配。
 */
export const FREEMARKER_ROOT_KEYWORDS = new Set([
  'if',
  'else',
  'elseif',
  'list',
  'sep',
  'items',
  'break',
  'continue',
  'assign',
  'global',
  'local',
  'include',
  'import',
  'attempt',
  'recover',
  'macro',
  'function',
  'return',
  'nested',
  'switch',
  'case',
  'default',
  'true',
  'false',
  'as',
  'lt',
  'gt',
  'lte',
  'gte',
]);

/**
 * FreeMarker 模板中的局部变量声明模式，匹配变量名用于误报豁免。
 */
export const FREEMARKER_LOCAL_VARIABLE_PATTERNS = [
  /<\s*#list\b[^>]*\bas\s+([a-zA-Z_]\w*)/g,
  /<\s*#assign\b\s+([a-zA-Z_]\w*)\s*=/g,
  /<\s*#local\b\s+([a-zA-Z_]\w*)\s*=/g,
  /<\s*#global\b\s+([a-zA-Z_]\w*)\s*=/g,
];

/**
 * 变量表达式中允许忽略的前缀字符
 */
export const FREEMARKER_PREFIX_TRIM_PATTERN = /^[(!#@/.\s]+/;

/**
 * 变量标红 marker 来源标识。
 */
export const EMAIL_TEMPLATE_MARKER_SOURCE = 'email-template-require-fields';

/**
 * 变量检测防抖时间。
 */
export const EMAIL_TEMPLATE_MARKER_DEBOUNCE_MS = 200;

/**
 * Monaco 公共默认配置（跨业务可复用）。
 */
export const MONACO_COMMON_EDITOR_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
  automaticLayout: true,
  minimap: { enabled: false },
  fontSize: 14,
  scrollBeyondLastLine: false,
  wordWrap: 'on',
};
