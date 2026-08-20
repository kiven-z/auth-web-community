import { downloadRoleImportTemplate, importRoleExcel } from '@/features/system/api/role/role';
import useSpreadsheetImportAction from '@/features/system/_shared/hooks/useSpreadsheetImportAction';

/** 角色页高级功能 composable 配置 */
export interface UseRoleAdvanceActionOptions {
  fetchTableData: () => Promise<void>;
}

/**
 * 角色 Excel 导入
 * @param options 导入配置
 * @returns 导入入口
 */
function useRoleAdvanceAction(options: UseRoleAdvanceActionOptions) {
  const { openImportDialog } = useSpreadsheetImportAction({
    onImport: importRoleExcel,
    onDownloadTemplate: downloadRoleImportTemplate,
    templateFilename: 'role_import_template.xlsx',
    onSuccess: options.fetchTableData,
  });

  return {
    openImportDialog,
  };
}

export default useRoleAdvanceAction;
