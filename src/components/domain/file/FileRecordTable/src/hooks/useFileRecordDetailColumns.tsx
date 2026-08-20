import { createAuditDetailColumns } from '@/components/table/AuditColumns';
import { formatFileSize } from '@/shared/utils/file/fileSize';
import { ElImage, ElLink, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 文件记录详情描述列
 * @returns 详情列配置
 */
function useFileRecordDetailColumns() {
  const { t } = useI18n();

  const detailColumns = computed(() => [
    { label: t('fileRecord.fields.originalName'), prop: 'originalName', labelWidth: 120, copy: true },
    { label: t('fileRecord.fields.extension'), prop: 'extension', labelWidth: 120 },
    { label: t('fileRecord.fields.storagePlatform'), prop: 'storagePlatform', labelWidth: 120 },
    { label: t('fileRecord.fields.uploadMode'), prop: 'uploadMode', labelWidth: 120, copy: true },
    {
      label: t('fileRecord.fields.size'),
      prop: 'size',
      labelWidth: 120,
      cellRenderer: ({ value }: { value?: number | null }) => <span>{formatFileSize(value ?? undefined)}</span>,
    },
    { label: t('fileRecord.fields.contentType'), prop: 'contentType', labelWidth: 120 },
    {
      label: t('fileRecord.fields.isPrivate'),
      prop: 'isPrivate',
      labelWidth: 120,
      cellRenderer: ({ value }: { value?: boolean | null }) =>
        value == null ? (
          <span>—</span>
        ) : (
          <ElTag type={value ? 'warning' : 'success'} effect="plain">
            {value ? t('status.yes') : t('status.no')}
          </ElTag>
        ),
    },
    { label: t('fileRecord.fields.bucket'), prop: 'bucket', labelWidth: 120, span: 2, copy: true },
    { label: t('fileRecord.fields.objectKey'), prop: 'objectKey', labelWidth: 120, span: 2, copy: true },
    {
      label: t('fileRecord.fields.url'),
      prop: 'url',
      labelWidth: 120,
      span: 2,
      cellRenderer({ value }) {
        return (
          <ElLink type="primary" target="_blank" href={value} underline="hover">
            {value}
          </ElLink>
        );
      },
      copy: true,
    },
    {
      label: t('fileRecord.fields.accessUrl'),
      prop: 'accessUrl',
      labelWidth: 120,
      span: 2,
      cellRenderer: ({ value, row }) => {
        if (!value) {
          return <span>—</span>;
        }
        if (row.contentType?.toLowerCase().startsWith('image/')) {
          return (
            <div class="flex flex-col space-x-2">
              <ElImage
                src={value}
                fit="cover"
                previewSrcList={[value]}
                previewTeleported
                style={{ width: '40px', height: '40px' }}
              />
              <ElLink type="primary" target="_blank" href={value} underline="hover">
                {value}
              </ElLink>
            </div>
          );
        }
        return <span>{value}</span>;
      },
      copy: true,
    },
    { label: t('fileRecord.fields.etag'), prop: 'etag', labelWidth: 120 },
    { label: t('fileRecord.fields.bizType'), prop: 'bizType', labelWidth: 120 },
    { label: t('fileRecord.fields.bizId'), prop: 'bizId', labelWidth: 120 },
    { label: t('fileRecord.fields.remark'), prop: 'remark', labelWidth: 120, span: 2 },
    ...createAuditDetailColumns(),
  ]);

  return { detailColumns };
}

export default useFileRecordDetailColumns;
