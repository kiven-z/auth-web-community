import { createAuditTableColumns } from '@/components/table/audit-columns';
import type { FileRecordPageRow } from '@/features/file/api/models/file-record';
import { formatFileSize } from '@/shared/utils/file/file-size';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 文件回收站表格列配置。
 * @returns 表格列定义
 */
function useFileRecycleTableColumns() {
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
      width: 70,
    },
    // 文件名称
    {
      label: t('fileRecycle.fields.originalName'),
      prop: 'originalName',
      minWidth: 220,
    },
    // 存储平台
    {
      label: t('fileRecycle.fields.storagePlatform'),
      prop: 'storagePlatform',
      minWidth: 120,
    },
    // 上传模式
    {
      label: t('fileRecycle.fields.uploadMode'),
      prop: 'uploadMode',
      minWidth: 110,
    },
    // 文件大小
    {
      label: t('fileRecycle.fields.size'),
      prop: 'size',
      minWidth: 120,
      render: ({ row }: { row: FileRecordPageRow }) => formatFileSize(row.size),
    },
    // 文件类型
    {
      label: t('fileRecycle.fields.contentType'),
      prop: 'contentType',
      minWidth: 180,
    },
    // 是否私有文件
    {
      label: t('fileRecycle.fields.isPrivate'),
      prop: 'isPrivate',
      minWidth: 110,
      render: ({ row }: { row: FileRecordPageRow }) =>
        row.isPrivate ? (
          <ElTag type="warning" effect="plain">
            {t('status.yes')}
          </ElTag>
        ) : (
          <ElTag type="success" effect="plain">
            {t('status.no')}
          </ElTag>
        ),
    },
    // 业务类型
    {
      label: t('fileRecycle.fields.bizType'),
      prop: 'bizType',
      minWidth: 130,
    },
    // 业务 ID
    {
      label: t('fileRecycle.fields.bizId'),
      prop: 'bizId',
      minWidth: 150,
    },
    ...createAuditTableColumns(),
    {
      label: t('table.actions'),
      fixed: 'right',
      minWidth: 240,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useFileRecycleTableColumns;
