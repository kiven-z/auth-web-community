import { transformI18n } from '@/app/plugins/i18n';
import { ElTag } from 'element-plus';

/** 岗位状态展示所需字段 */
interface PostStatusDisplayRow {
  status: boolean;
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

  return row.status ? (
    <ElTag type="success" effect="plain">
      {transformI18n('buttons.statusActiveText')}
    </ElTag>
  ) : (
    <ElTag type="danger" effect="plain">
      {transformI18n('buttons.statusInactiveText')}
    </ElTag>
  );
}
