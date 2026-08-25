import { transformI18n } from '@/app/plugins/i18n';
import { ElTag } from 'element-plus';

/** 部门状态展示所需字段（与后端 SysDeptListVO / Detail.effective 对齐） */
interface DeptStatusDisplayRow {
  status?: boolean | null;
  /** 计算有效（后端投影） */
  effective?: boolean | null;
}

interface RenderDeptStatusTagOptions {
  /** 本节点启用且计算有效时不渲染（选择器选项避免铺满「启用」） */
  omitActive?: boolean;
  /** 标签尺寸；选择器选项用 small */
  size?: 'large' | 'default' | 'small';
}

/**
 * 部门状态标签：启用 / 本节点禁用 / 祖先停用（传播禁用）
 * @param row 部门行
 * @param options 渲染选项
 */
export function renderDeptStatusTag(row: DeptStatusDisplayRow, options?: RenderDeptStatusTagOptions) {
  const status = row.status === true;
  const effective = row.effective === true;
  const size = options?.size;

  if (status && !effective) {
    return (
      <ElTag type="warning" effect="plain" size={size}>
        {transformI18n('dept.status.propagatedInactive')}
      </ElTag>
    );
  }
  if (!status) {
    return (
      <ElTag type="danger" effect="plain" size={size}>
        {transformI18n('buttons.statusInactiveText')}
      </ElTag>
    );
  }
  if (options?.omitActive) {
    return null;
  }
  return (
    <ElTag type="success" effect="plain" size={size}>
      {transformI18n('buttons.statusActiveText')}
    </ElTag>
  );
}
