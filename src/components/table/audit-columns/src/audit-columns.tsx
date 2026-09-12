import { transformI18n } from '@/app/plugins/i18n';
import { formatDateTime } from '@/shared/utils/date/date-time';

/**
 * 列表审计列（创建/更新时间可排序，创建/更新人展示姓名）
 * @returns 表格列配置
 */
export function createAuditTableColumns() {
  return [
    {
      label: transformI18n('table.createdAt'),
      prop: 'createdAt',
      sortable: true,
      minWidth: 170,
      render: ({ row }: { row: { createdAt?: unknown } }) => formatDateTime(row.createdAt),
    },
    {
      label: transformI18n('table.updatedAt'),
      prop: 'updatedAt',
      sortable: true,
      minWidth: 170,
      render: ({ row }: { row: { updatedAt?: unknown } }) => formatDateTime(row.updatedAt),
    },
    {
      label: transformI18n('table.createdByName'),
      prop: 'createdByName',
      minWidth: 130,
      render: ({ row }: { row: { createdBy?: string | null; createdByName?: string | null } }) => {
        const createdBy = row.createdBy;
        if (!createdBy) {
          return null;
        }
        return row.createdByName ?? createdBy;
      },
    },
    {
      label: transformI18n('table.updatedByName'),
      prop: 'updatedByName',
      minWidth: 130,
      render: ({ row }: { row: { updatedBy?: string | null; updatedByName?: string | null } }) => {
        const updatedBy = row.updatedBy;
        if (!updatedBy) {
          return null;
        }
        return row.updatedByName ?? updatedBy;
      },
    },
  ];
}

/**
 * 详情 Description 审计列（创建/更新时间格式化，创建/更新人展示姓名）
 * @returns 详情列配置
 */
export function createAuditDetailColumns() {
  return [
    {
      label: transformI18n('table.createdAt'),
      prop: 'createdAt',
      labelWidth: 120,
      cellRenderer: ({ value }: { value: any }) => formatDateTime(value),
    },
    {
      label: transformI18n('table.updatedAt'),
      prop: 'updatedAt',
      labelWidth: 120,
      cellRenderer: ({ value }: { value: any }) => formatDateTime(value),
    },
    {
      label: transformI18n('table.createdByName'),
      prop: 'createdByName',
      labelWidth: 120,
      cellRenderer({ value, row }: { value: any; row: any }) {
        if (!row?.createdBy) {
          return <span>—</span>;
        }
        return value ?? row.createdBy;
      },
    },
    {
      label: transformI18n('table.updatedByName'),
      prop: 'updatedByName',
      labelWidth: 120,
      cellRenderer({ value, row }: { value: any; row: any }) {
        if (!row?.updatedBy) {
          return <span>—</span>;
        }
        return value ?? row.updatedBy;
      },
    },
  ];
}
