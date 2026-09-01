import { createAuditDetailColumns } from '@/components/table/audit-columns';
import { formatFileSize } from '@/shared/utils/file/file-size';
import { ElImage, ElLink, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 文件回收站详情描述列
 * @returns 详情列配置
 */
function useFileRecycleDetailColumns() {
  const { t } = useI18n();

  const detailColumns = computed(() => [
    { label: t('fileRecycle.fields.originalName'), prop: 'originalName', labelWidth: 120, copy: true },
    { label: t('fileRecycle.fields.storagePlatform'), prop: 'storagePlatform', labelWidth: 120 },
    { label: t('fileRecycle.fields.uploadMode'), prop: 'uploadMode', labelWidth: 120, copy: true },
    {
      label: t('fileRecycle.fields.size'),
      prop: 'size',
      labelWidth: 120,
      cellRenderer: ({ value }: { value?: number | null }) => <span>{formatFileSize(value ?? undefined)}</span>,
    },
    { label: t('fileRecycle.fields.contentType'), prop: 'contentType', labelWidth: 120 },
    {
      label: t('fileRecycle.fields.isPrivate'),
      prop: 'isPrivate',
      labelWidth: 120,
      cellRenderer: ({ value }: { value?: boolean | null }) => {
        if (!value) {
          return <span>—</span>;
        }

        return (
          <ElTag type={value ? 'warning' : 'success'} effect="plain">
            {value ? t('status.yes') : t('status.no')}
          </ElTag>
        );
      },
    },
    { label: t('fileRecycle.fields.bucket'), prop: 'bucket', labelWidth: 120, span: 2, copy: true },
    { label: t('fileRecycle.fields.objectKey'), prop: 'objectKey', labelWidth: 120, span: 2, copy: true },
    {
      label: t('fileRecycle.fields.url'),
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
      label: t('fileRecycle.fields.accessUrl'),
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
    { label: t('fileRecycle.fields.bizType'), prop: 'bizType', labelWidth: 120 },
    { label: t('fileRecycle.fields.bizId'), prop: 'bizId', labelWidth: 120 },
    { label: t('fileRecycle.fields.remark'), prop: 'remark', labelWidth: 120, span: 2 },
    ...createAuditDetailColumns(),
  ]);

  return { detailColumns };
}

export default useFileRecycleDetailColumns;
