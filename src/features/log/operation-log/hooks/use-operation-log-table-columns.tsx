import { formatDateTime } from '@/shared/utils/date/date-time';
/**
 * 操作日志表格列
 */
import type { OperationLogPageRow } from '@/features/log/api/operation-log';
import { selectUserinfo } from '@/components/domain/user/user-profile';
import { ElButton } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 表格列配置
 * @returns 表格列定义
 */
function useOperationLogTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    {
      type: 'selection',
      width: 50,
    },
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      minWidth: 60,
    },
    // 操作用户
    {
      label: t('operationLog.user'),
      prop: 'username',
      minWidth: 130,
      render: ({ row }: { row: OperationLogPageRow }) => {
        const uid = row.userId;
        if (!uid) {
          return <span>—</span>;
        }
        return (
          <ElButton link type="primary" onClick={() => selectUserinfo(uid, row.username)}>
            {row.username ?? uid}
          </ElButton>
        );
      },
    },
    // 操作模块
    {
      label: t('operationLog.module'),
      prop: 'module',
      minWidth: 170,
    },
    // 操作类型
    {
      label: t('operationLog.operationType'),
      prop: 'operationType',
      minWidth: 120,
    },
    // 目标类型
    {
      label: t('operationLog.targetType'),
      prop: 'targetType',
      minWidth: 110,
    },
    // 目标 ID
    {
      label: t('operationLog.targetId'),
      prop: 'targetId',
      minWidth: 140,
    },
    // HTTP 方法
    {
      label: t('operationLog.requestMethod'),
      prop: 'requestMethod',
      minWidth: 100,
    },
    // 响应状态码
    {
      label: t('operationLog.responseStatus'),
      prop: 'responseStatus',
      minWidth: 110,
    },
    // 执行耗时
    {
      label: t('operationLog.executionTimeMs'),
      prop: 'executionTimeMs',
      minWidth: 110,
    },
    // 请求 IP
    {
      label: t('operationLog.ipAddress'),
      prop: 'ipAddress',
      minWidth: 150,
    },
    // 创建时间
    {
      label: t('table.createdAt'),
      prop: 'createdAt',
      sortable: true,
      minWidth: 170,
      render: ({ row }: { row: OperationLogPageRow }) => formatDateTime(row.createdAt),
    },
    // 操作
    {
      label: t('table.actions'),
      fixed: 'right',
      width: 120,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useOperationLogTableColumns;
