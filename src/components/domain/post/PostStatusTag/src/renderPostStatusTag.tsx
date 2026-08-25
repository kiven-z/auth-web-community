import { transformI18n } from '@/app/plugins/i18n';
import { renderActiveStatusTag, renderInactiveStatusTag } from '@/components/table/BooleanStatusTag';
import { ElTag } from 'element-plus';

/** 岗位状态展示所需字段（与后端 SysPostPageVO / Detail.effective 对齐） */
interface PostStatusDisplayRow {
  status: boolean;
  /** 计算有效（后端投影：本节点启用且所属部门有效） */
  effective: boolean;
}

/**
 * 岗位状态标签：启用 / 本节点禁用 / 所属部门无效（传播禁用）
 * @param row 岗位行
 */
export function renderPostStatusTag(row: PostStatusDisplayRow) {
  if (row.status === true && row.effective === false) {
    return (
      <ElTag type="warning" effect="plain">
        {transformI18n('post.status.propagatedInactive')}
      </ElTag>
    );
  }
  return row.status ? renderActiveStatusTag() : renderInactiveStatusTag();
}
