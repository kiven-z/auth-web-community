import type { EmailTemplateRequireFieldRow } from '@/features/message/api/email-template';
import { getRootVariableName, type MonacoModule } from '@/features/message/email-template/monaco/validator';
import type { editor, IPosition } from 'monaco-editor';

/**
 * 文本偏移转 Monaco 位置。
 */
function offsetToPosition(model: editor.ITextModel, offset: number, monacoApi: MonacoModule): IPosition {
  const pos = model.getPositionAt(offset);
  return new monacoApi.Position(pos.lineNumber, pos.column);
}

/**
 * 注册模板变量补全与悬浮信息。
 */
export function registerEmailTemplateProviders(
  model: editor.ITextModel,
  monacoApi: MonacoModule,
  getRequireFields: () => EmailTemplateRequireFieldRow[]
) {
  const providerDisposables: Array<{ dispose: () => void }> = [];

  providerDisposables.push(
    monacoApi.languages.registerCompletionItemProvider('html', {
      triggerCharacters: ['$', '{'],
      provideCompletionItems(currentModel, position) {
        if (currentModel !== model) {
          return { suggestions: [] };
        }

        const line = currentModel.getLineContent(position.lineNumber);
        const before = line.substring(0, position.column - 1);
        const dollarIdx = before.lastIndexOf('${');
        if (dollarIdx < 0) {
          return { suggestions: [] };
        }

        const inner = before.slice(dollarIdx + 2);
        if (inner.includes('}')) {
          return { suggestions: [] };
        }

        const inputWord = inner.trim();
        const lineAfterCursor = line.substring(position.column - 1);
        const hasClosingBrace = lineAfterCursor.startsWith('}');
        const range = new monacoApi.Range(position.lineNumber, dollarIdx + 3, position.lineNumber, position.column);
        const suggestions = getRequireFields()
          .filter((field) => field.key?.startsWith(inputWord))
          .map((field) => ({
            label: field.key,
            kind: monacoApi.languages.CompletionItemKind.Variable,
            insertText: hasClosingBrace ? field.key : `${field.key}}`,
            detail: field.description,
            range,
          }));

        return { suggestions };
      },
    }),
    monacoApi.languages.registerHoverProvider('html', {
      provideHover(currentModel, position) {
        if (currentModel !== model) {
          return null;
        }

        const fieldMap = new Map<string, EmailTemplateRequireFieldRow>();
        for (const row of getRequireFields()) {
          if (row?.key) {
            fieldMap.set(row.key, row);
          }
        }

        const offset = currentModel.getOffsetAt(position);
        const text = currentModel.getValue();
        const matcher = /\$\{([^}]*)\}/g;
        let result: RegExpExecArray | null;

        while ((result = matcher.exec(text)) !== null) {
          const start = result.index;
          const end = start + result[0].length;
          if (offset < start || offset > end) {
            continue;
          }
          const name = getRootVariableName(result[1]);
          if (!name) {
            continue;
          }
          const row = fieldMap.get(name);
          if (!row) {
            continue;
          }

          const openInner = start + 2;
          const range = monacoApi.Range.fromPositions(
            offsetToPosition(currentModel, openInner, monacoApi),
            offsetToPosition(currentModel, Math.min(openInner + name.length, text.length), monacoApi)
          );
          const sample =
            row.exampleValue === undefined || row.exampleValue === null ? '' : JSON.stringify(row.exampleValue);
          return {
            range,
            contents: [{ value: `${row.description ?? ''}\n\n示例字段值：${sample}` }],
          };
        }

        return null;
      },
    })
  );

  return {
    dispose: () => {
      providerDisposables.forEach((item) => item.dispose());
    },
  };
}
