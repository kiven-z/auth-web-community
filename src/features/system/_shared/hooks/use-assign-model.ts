import { computed, ref, unref, watch, type ComputedRef, type MaybeRef, type Ref } from 'vue';

import type { AssignGetRowLabel, AssignSeedItem } from '@/features/system/_shared/types';
import { toStableKey } from '@/shared/utils/string/to-stable-key';

/** {@link useAssignModel} 配置 */
export interface UseAssignModelOptions {
  getRowLabel: AssignGetRowLabel;
  /** 行主键，默认 `id` */
  rowKey?: string;
  /** 与面板 v-model 共用的已选 key */
  selectedKeys?: Ref<string[]>;
  /** 候选表当前页，用于补 label 与本页全选 */
  rows?: { readonly value: readonly unknown[] };
  /** 禁用勾选（如保存中） */
  disabled?: MaybeRef<boolean>;
}

/**
 * 分配勾选模型：完整 key 集合 + label 缓存
 * @param options 行主键、文案解析、可选外部 key / 当前页行
 * @returns 已选 key、label 与勾选操作
 */
export function useAssignModel(options: UseAssignModelOptions) {
  const rowKey = options.rowKey ?? 'id';
  const selectedKeys = options.selectedKeys ?? ref<string[]>([]);
  const labels = ref<Record<string, string>>({});

  const pageRows = computed(() => (options.rows?.value ?? []) as Record<string, unknown>[]);

  const isPageFullySelected = computed(() => {
    const rows = pageRows.value;
    return rows.length > 0 && rows.every((row) => isSelected(row));
  });

  const isPageIndeterminate = computed(() => {
    const rows = pageRows.value;
    if (!rows.length) {
      return false;
    }
    const selectedCount = rows.filter((row) => isSelected(row)).length;
    return selectedCount > 0 && selectedCount < rows.length;
  });

  /**
   * 解析行展示文案
   * @param row 行数据
   * @returns 行 label
   */
  function resolveRowLabel(row: Record<string, unknown>): string {
    return options.getRowLabel(row) || toStableKey(row[rowKey] ?? '');
  }

  /**
   * 解析行主键
   * @param row 行数据
   * @returns 行 key
   */
  function resolveRowKey(row: Record<string, unknown>): string {
    return toStableKey(row[rowKey] ?? '');
  }

  /**
   * 由已分配种子重建 key 与 label
   * @param seed 种子数据
   */
  function applyAssigned(seed: AssignSeedItem[]) {
    const keys: string[] = [];
    const nextLabels: Record<string, string> = {};
    const seen = new Set<string>();

    for (const item of seed) {
      const key = item.key.trim();
      if (!key || seen.has(key)) {
        continue;
      }
      seen.add(key);
      keys.push(key);
      nextLabels[key] = item.label.trim() || key;
    }

    selectedKeys.value = keys;
    labels.value = nextLabels;
    if (pageRows.value.length) {
      mergeLabels(pageRows.value);
    }
  }

  /**
   * 用当前页行补 label（已有非 key 文案则保留）
   * @param rows 行数据
   */
  function mergeLabels(rows: Record<string, unknown>[]) {
    if (!rows.length) {
      return;
    }
    const next = { ...labels.value };
    for (const row of rows) {
      const key = resolveRowKey(row);
      if (!key) {
        continue;
      }
      const existing = next[key];
      if (!existing || existing === key) {
        next[key] = resolveRowLabel(row);
      }
    }
    labels.value = next;
  }

  /**
   * 判断行是否已选
   * @param row 行数据
   * @returns 是否已选
   */
  function isSelected(row: Record<string, unknown>): boolean {
    const key = resolveRowKey(row);
    return key ? selectedKeys.value.includes(key) : false;
  }

  /**
   * 切换行勾选并写入 label
   * @param row 行数据
   */
  function toggle(row: Record<string, unknown>) {
    const key = resolveRowKey(row);
    if (!key) {
      return;
    }
    if (isSelected(row)) {
      selectedKeys.value = selectedKeys.value.filter((item) => item !== key);
      return;
    }
    labels.value = { ...labels.value, [key]: resolveRowLabel(row) };
    selectedKeys.value = [...selectedKeys.value, key];
  }

  /**
   * 切换本页全选
   */
  function togglePage() {
    if (unref(options.disabled) === true) {
      return;
    }
    const rows = pageRows.value;
    if (!rows.length) {
      return;
    }
    if (isPageFullySelected.value) {
      const pageKeys = new Set(rows.map((row) => resolveRowKey(row)).filter(Boolean));
      selectedKeys.value = selectedKeys.value.filter((key) => !pageKeys.has(key));
      return;
    }
    const nextLabels = { ...labels.value };
    const nextKeys = new Set(selectedKeys.value);
    for (const row of rows) {
      const key = resolveRowKey(row);
      if (!key) {
        continue;
      }
      nextKeys.add(key);
      nextLabels[key] = resolveRowLabel(row);
    }
    labels.value = nextLabels;
    selectedKeys.value = [...nextKeys];
  }

  /**
   * 行点击切换勾选（忽略 checkbox 等控件点击）
   * @param row 行数据
   * @param _column 列
   * @param event 鼠标事件
   */
  function handleRowClick(row: Record<string, unknown>, _column: unknown, event: Event) {
    if (unref(options.disabled) === true) {
      return;
    }
    if ((event.target as HTMLElement).closest('.el-checkbox, .el-checkbox__input, button, a')) {
      return;
    }
    toggle(row);
  }

  watch(
    () => options.rows?.value,
    (rows) => {
      if (rows?.length) {
        mergeLabels(rows as Record<string, unknown>[]);
      }
    },
    { immediate: true }
  );

  return {
    selectedKeys,
    labels,
    applyAssigned,
    isSelected,
    toggle,
    togglePage,
    handleRowClick,
    isPageFullySelected,
    isPageIndeterminate,
  };
}

export interface AssignModel {
  isSelected: (row: Record<string, unknown>) => boolean;
  toggle: (row: Record<string, unknown>) => void;
  togglePage: () => void;
  isPageFullySelected: ComputedRef<boolean>;
  isPageIndeterminate: ComputedRef<boolean>;
}
