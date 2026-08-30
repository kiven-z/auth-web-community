import type { EmailTemplateRequireFieldRow } from '@/features/message/api/emailTemplate';
import { EMAIL_TEMPLATE_MARKER_DEBOUNCE_MS } from '@/features/message/email-template/config/monacoConfig';
import { registerEmailTemplateProviders } from '@/features/message/email-template/monaco/providers';
import {
  applyRequireFieldsMarkers,
  clearRequireFieldsMarkers,
  type MonacoModule,
} from '@/features/message/email-template/monaco/validator';
import type { editor } from 'monaco-editor';

/**
 * 注册邮件模板 Monaco 能力：补全、悬浮、未声明变量标红。
 */
export function registerEmailTemplateMonaco(
  editorInstance: editor.IStandaloneCodeEditor,
  monacoApi: MonacoModule,
  getRequireFields: () => EmailTemplateRequireFieldRow[]
): { dispose: () => void; refreshMarkers: () => void } {
  const model = editorInstance.getModel();
  if (!model) {
    const noop = () => {};
    return { dispose: noop, refreshMarkers: noop };
  }

  const disposables: Array<{ dispose: () => void }> = [];
  const providers = registerEmailTemplateProviders(model, monacoApi, getRequireFields);
  disposables.push(providers);

  let markerTimer: ReturnType<typeof setTimeout> | null = null;
  let applyingMarkers = false;

  /**
   * 刷新未声明变量标红。
   */
  const refreshMarkers = () => {
    if (markerTimer) {
      clearTimeout(markerTimer);
    }
    markerTimer = setTimeout(() => {
      markerTimer = null;
      const keys = new Set(
        getRequireFields()
          .map((row) => row.key)
          .filter(Boolean)
      );
      applyingMarkers = true;
      try {
        applyRequireFieldsMarkers(model, monacoApi, keys);
      } finally {
        applyingMarkers = false;
      }
    }, EMAIL_TEMPLATE_MARKER_DEBOUNCE_MS);
  };

  /**
   * 注册内容变化事件。
   */
  disposables.push(
    model.onDidChangeContent(() => {
      if (applyingMarkers) {
        return;
      }
      refreshMarkers();
    })
  );

  /**
   * 初始化刷新未声明变量标红。
   */
  queueMicrotask(() => {
    if (!model.isDisposed()) {
      refreshMarkers();
    }
  });

  /**
   * 释放资源。
   */
  const dispose = () => {
    if (markerTimer) {
      clearTimeout(markerTimer);
      markerTimer = null;
    }
    clearRequireFieldsMarkers(model, monacoApi);
    disposables.forEach((item) => item.dispose());
  };

  return { dispose, refreshMarkers };
}
