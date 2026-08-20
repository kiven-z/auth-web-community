import { ElCheckbox } from 'element-plus';
import { unref, type MaybeRef } from 'vue';

import type { AssignModel } from '@/features/system/_shared/hooks/useAssignModel';

/** {@link createAssignCheckboxColumn} 列配置 */
export interface CreateAssignCheckboxColumnOptions {
  /** 行是否已选 */
  isSelected: (row: Record<string, unknown>) => boolean;
  /** 切换行勾选 */
  toggle: (row: Record<string, unknown>) => void;
  /** 本页是否全选 */
  isPageFullySelected: MaybeRef<boolean>;
  /** 本页是否半选 */
  isPageIndeterminate: MaybeRef<boolean>;
  /** 切换本页全选 */
  togglePage: () => void;
  /** 保存中时禁用勾选 */
  saving?: MaybeRef<boolean>;
  /** 列标题 */
  label: string;
}

/**
 * 生成分配勾选列（含表头本页全选）
 * @param options 勾选判定、切换与列标题
 * @returns 表格列定义
 */
export function createAssignCheckboxColumn(options: CreateAssignCheckboxColumnOptions): TableColumns {
  const disabled = () => unref(options.saving) === true;

  return {
    label: options.label,
    prop: '__assign',
    align: 'center',
    width: 80,
    headerRender: () => (
      <ElCheckbox
        indeterminate={unref(options.isPageIndeterminate)}
        model-value={unref(options.isPageFullySelected)}
        disabled={disabled()}
        onClick={(event: Event) => event.stopPropagation()}
        onChange={() => options.togglePage()}
      />
    ),
    render: ({ row }: { row: Record<string, unknown> }) => {
      return (
        <ElCheckbox
          model-value={options.isSelected(row)}
          disabled={disabled()}
          onClick={(event: Event) => event.stopPropagation()}
          onChange={() => options.toggle(row)}
        />
      );
    },
  };
}

/**
 * 由 {@link useAssignModel} 生成分配勾选列
 * @param model 分配勾选模型
 * @param options 列标题与禁用态
 * @returns 表格列定义
 */
export function createAssignCheckboxColumnFromModel(
  model: AssignModel,
  options: { label: string; saving?: MaybeRef<boolean> }
): TableColumns {
  return createAssignCheckboxColumn({
    isSelected: model.isSelected,
    toggle: model.toggle,
    isPageFullySelected: model.isPageFullySelected,
    isPageIndeterminate: model.isPageIndeterminate,
    togglePage: model.togglePage,
    saving: options.saving,
    label: options.label,
  });
}
