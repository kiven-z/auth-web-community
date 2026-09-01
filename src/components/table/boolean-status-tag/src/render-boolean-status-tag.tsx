import { transformI18n } from '@/app/plugins/i18n';
import { ElTag } from 'element-plus';

/** 启用状态标签（`buttons.statusActiveText`） */
export function renderActiveStatusTag() {
  return (
    <ElTag type="success" effect="plain">
      {transformI18n('buttons.statusActiveText')}
    </ElTag>
  );
}

/** 停用状态标签（`buttons.statusInactiveText`） */
export function renderInactiveStatusTag() {
  return (
    <ElTag type="danger" effect="plain">
      {transformI18n('buttons.statusInactiveText')}
    </ElTag>
  );
}
