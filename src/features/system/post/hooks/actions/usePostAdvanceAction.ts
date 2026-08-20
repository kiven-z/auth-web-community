import { downloadPostImportTemplate, importPostExcel } from '@/features/system/api/post/post';
import useSpreadsheetImportAction from '@/features/system/_shared/hooks/useSpreadsheetImportAction';

/** 岗位页高级功能 composable 配置 */
export interface UsePostAdvanceActionOptions {
  fetchTableData: () => Promise<void>;
}

/**
 * 岗位 Excel 导入
 * @param options 导入配置
 * @returns 导入入口
 */
function usePostAdvanceAction(options: UsePostAdvanceActionOptions) {
  const { openImportDialog } = useSpreadsheetImportAction({
    onImport: importPostExcel,
    onDownloadTemplate: downloadPostImportTemplate,
    templateFilename: 'post_import_template.xlsx',
    onSuccess: options.fetchTableData,
  });

  return {
    openImportDialog,
  };
}

export default usePostAdvanceAction;
