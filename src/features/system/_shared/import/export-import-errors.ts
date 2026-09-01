import type { ImportRowError } from '@/api/common/import';
import { buildExportFilenameStamp } from '@/shared/utils/date/date-time';
import { downloadBlob } from '@/shared/utils/file/download';
import * as XLSX from 'xlsx';

/** 导入错误 Excel 列定义 */
export interface ImportErrorExcelColumn {
  /** 表头文案 */
  header: string;
  /** 对应错误行字段 */
  key: keyof ImportRowError;
}

/**
 * 根据模板文件名生成导入错误报告文件名
 * @param templateFilename 模板文件名，如 post_import_template.xlsx
 * @param stamp 时间戳片段，默认当前时刻
 * @returns 错误报告文件名
 */
export function buildImportErrorReportFilename(templateFilename: string, stamp?: string): string {
  const resolvedStamp = stamp ?? buildExportFilenameStamp();
  return templateFilename.replace(/_template\.xlsx$/i, `_import_errors_${resolvedStamp}.xlsx`);
}

/**
 * 将导入行级错误导出为 Excel 并触发浏览器下载
 * @param errors 行级错误列表
 * @param filename 保存文件名
 * @param columns Excel 列定义（表头与字段映射）
 */
export function downloadImportErrorsExcel(
  errors: ImportRowError[],
  filename: string,
  columns: ImportErrorExcelColumn[]
): void {
  const rows = errors.map((error) =>
    columns.reduce<Record<string, string | number>>((row, column) => {
      row[column.header] = error[column.key];
      return row;
    }, {})
  );
  const sheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, 'Errors');
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  downloadBlob(blob, filename);
}
