import { downloadPermissionImportTemplate, importPermissionExcel } from '@/features/system/api/permission/permission';
import useSpreadsheetImportAction from '@/features/system/_shared/hooks/use-spreadsheet-import-action';

/** 权限页高级功能 composable 配置 */
export interface UsePermissionAdvanceActionOptions {
  fetchTableData: () => Promise<void>;
}

/**
 * 权限 Excel 导入
 * @param options 导入配置
 * @returns 导入入口
 */
function usePermissionAdvanceAction(options: UsePermissionAdvanceActionOptions) {
  const { openImportDialog } = useSpreadsheetImportAction({
    onImport: importPermissionExcel,
    onDownloadTemplate: downloadPermissionImportTemplate,
    templateFilename: 'permission_import_template.xlsx',
    onSuccess: options.fetchTableData,
  });

  return {
    openImportDialog,
  };
}

export default usePermissionAdvanceAction;
