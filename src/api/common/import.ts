/**
 * 单行导入失败信息
 */
export interface ImportRowError {
  /** 行号（1-based，不含表头） */
  rowIndex: number;
  /** 失败原因 */
  message: string;
}

/**
 * Excel 批量导入结果
 */
export interface SpreadsheetImportResult {
  /** 是否全部成功 */
  success: boolean;
  /** 成功导入行数 */
  importedCount: number;
  /** 行级错误列表；成功时为空数组 */
  errors: ImportRowError[];
}
