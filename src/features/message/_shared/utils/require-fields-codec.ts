import type { MessageTemplateRequireFieldRow } from '@/features/message/api/models/message-template';

/** 表格编辑行：契约字段 + 稳定 uid；exampleValue 以文本编辑 */
export interface RequireFieldEditRow {
  uid: number;
  key: string;
  description?: string;
  exampleValue: string;
}

/** require_fields JSON 解析结果（仅判断能否组请求体，不做业务校验） */
type ParseRequireFieldsResult = { ok: true; rows: MessageTemplateRequireFieldRow[] } | { ok: false };

/**
 * 将示例值转为表格单元格文本
 * @param value 契约 exampleValue
 */
function exampleValueToCellText(value: unknown): string {
  if (value == null) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  return JSON.stringify(value);
}

/**
 * 将表格单元格文本还原为 exampleValue
 * @param text 单元格文本
 */
function exampleValueFromCellText(text: string): unknown {
  const trimmed = text.trim();
  if (trimmed === '') {
    return '';
  }
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return text;
  }
}

/**
 * API 行 → 表格编辑行
 * @param rows 契约变量列表
 */
export function toEditRows(rows: MessageTemplateRequireFieldRow[]): RequireFieldEditRow[] {
  return rows.map((row, index) => ({
    uid: index + 1,
    key: row.key,
    description: row.description,
    exampleValue: exampleValueToCellText(row.exampleValue),
  }));
}

/**
 * 表格编辑行 → API 行
 * @param rows 表格编辑行
 */
export function fromEditRows(rows: RequireFieldEditRow[]): MessageTemplateRequireFieldRow[] {
  return rows.map(({ key, description, exampleValue }) => ({
    key,
    description: description?.trim() ? description : undefined,
    exampleValue: exampleValueFromCellText(exampleValue),
  }));
}

/**
 * 解析 JSON 编辑器文本为变量列表
 * @param text JSON 文本
 */
export function parseRequireFieldsJson(text: string): ParseRequireFieldsResult {
  try {
    const parsed: unknown = JSON.parse(text);
    if (!Array.isArray(parsed)) {
      return { ok: false };
    }
    return { ok: true, rows: parsed as MessageTemplateRequireFieldRow[] };
  } catch {
    return { ok: false };
  }
}
