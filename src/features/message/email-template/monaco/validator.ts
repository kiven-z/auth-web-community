import {
  EMAIL_TEMPLATE_MARKER_SOURCE,
  FREEMARKER_LOCAL_VARIABLE_PATTERNS,
  FREEMARKER_PREFIX_TRIM_PATTERN,
  FREEMARKER_ROOT_KEYWORDS,
} from '@/features/message/email-template/config/monaco-config';
import type { editor } from 'monaco-editor';

export type MonacoModule = typeof import('monaco-editor');

interface VariableIssue {
  start: number;
  end: number;
  name: string;
}

/**
 * 从 `${...}` 中提取根变量名
 */
export function getRootVariableName(inner: string): string | null {
  const normalized = inner.trim().replace(FREEMARKER_PREFIX_TRIM_PATTERN, '');
  const match = /^([a-zA-Z_]\w*)/.exec(normalized);
  if (!match) {
    return null;
  }
  const name = match[1];
  if (FREEMARKER_ROOT_KEYWORDS.has(name)) {
    return null;
  }
  return name;
}

/**
 * 提取模板中声明的局部变量
 */
export function collectFreemarkerLocalVariables(text: string): Set<string> {
  const localKeys = new Set<string>();
  for (const pattern of FREEMARKER_LOCAL_VARIABLE_PATTERNS) {
    pattern.lastIndex = 0;
    let result: RegExpExecArray | null;
    while ((result = pattern.exec(text)) !== null) {
      const alias = result[1];
      if (alias) {
        localKeys.add(alias);
      }
    }
  }
  return localKeys;
}

/**
 * 收集未在 requireFields 中声明的变量位置
 */
export function collectUnknownVariableMarkers(
  text: string,
  keys: Set<string>,
  ignoredKeys: Set<string> = new Set()
): VariableIssue[] {
  const issues: VariableIssue[] = [];
  const matcher = /\$\{([^}]*)\}/g;
  let result: RegExpExecArray | null;

  while ((result = matcher.exec(text)) !== null) {
    const name = getRootVariableName(result[1]);
    if (!name || keys.has(name) || ignoredKeys.has(name)) {
      continue;
    }
    const openOffset = result.index + 2;
    issues.push({
      start: openOffset,
      end: openOffset + name.length,
      name,
    });
  }

  return issues;
}

/**
 * 文本偏移转 Monaco 位置
 */
function offsetToPosition(model: editor.ITextModel, offset: number, monacoApi: MonacoModule) {
  const pos = model.getPositionAt(offset);
  return new monacoApi.Position(pos.lineNumber, pos.column);
}

/**
 * 刷新变量 marker
 */
export function applyRequireFieldsMarkers(
  model: editor.ITextModel,
  monacoApi: MonacoModule,
  requireFieldKeys: Set<string>
) {
  const text = model.getValue();
  const localKeys = collectFreemarkerLocalVariables(text);
  const issues = collectUnknownVariableMarkers(text, requireFieldKeys, localKeys);
  const markers: editor.IMarkerData[] = issues.map((issue) => {
    const startPos = offsetToPosition(model, issue.start, monacoApi);
    const endPos = offsetToPosition(model, Math.min(issue.end, text.length), monacoApi);
    return {
      severity: monacoApi.MarkerSeverity.Error,
      message: `变量未在 require_fields 中声明: ${issue.name}`,
      startLineNumber: startPos.lineNumber,
      startColumn: startPos.column,
      endLineNumber: endPos.lineNumber,
      endColumn: endPos.column,
    };
  });

  monacoApi.editor.setModelMarkers(model, EMAIL_TEMPLATE_MARKER_SOURCE, markers);
}

/**
 * 清理变量 marker
 */
export function clearRequireFieldsMarkers(model: editor.ITextModel, monacoApi: MonacoModule) {
  monacoApi.editor.setModelMarkers(model, EMAIL_TEMPLATE_MARKER_SOURCE, []);
}
