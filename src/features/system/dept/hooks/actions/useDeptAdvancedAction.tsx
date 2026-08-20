import type { DialogOptions } from '@/components/ui/Dialog';
import { addDialog, closeDialog } from '@/components/ui/Dialog';
import useSpreadsheetImportAction from '@/features/system/_shared/hooks/useSpreadsheetImportAction';
import { downloadDeptImportTemplate, importDeptExcel } from '@/features/system/api/dept/dept';
import DeptClosureHealthDialog from '@/features/system/dept/components/tools/DeptClosureHealthDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface ClosureHealthDialogExpose {
  reload: () => Promise<void>;
}

/** 部门高级操作配置 */
export interface UseDeptAdvancedActionOptions {
  refresh: () => Promise<void>;
}

/**
 * 部门工具栏「高级功能」
 * @param options 高级操作配置
 * @returns 高级功能操作方法
 */
function useDeptAdvancedAction(options: UseDeptAdvancedActionOptions) {
  const { t } = useI18n();
  const { openImportDialog } = useSpreadsheetImportAction({
    onImport: importDeptExcel,
    onDownloadTemplate: downloadDeptImportTemplate,
    templateFilename: 'dept_import_template.xlsx',
    onSuccess: options.refresh,
  });

  /**
   * 打开闭包表健康检查弹窗
   */
  const openClosureHealthDialog = () => {
    const panelRef = ref<ClosureHealthDialogExpose | null>(null);

    const footerButtons: DialogOptions['footerButtons'] = [
      {
        label: t('dept.closureHealth.recheck'),
        type: 'primary',
        btnClick: async () => {
          await panelRef.value?.reload();
        },
      },
      {
        label: t('buttons.close'),
        text: true,
        bg: true,
        btnClick: ({ dialog: { options, index } }) => {
          closeDialog(options, index, { command: 'close' });
        },
      },
    ];

    addDialog({
      title: t('dept.closureHealth.title'),
      width: '72%',
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      destroyOnClose: true,
      footerButtons,
      contentRenderer: () => h(DeptClosureHealthDialog, { ref: panelRef }),
    });
  };

  return {
    openImportDialog,
    openClosureHealthDialog,
  };
}

export default useDeptAdvancedAction;
