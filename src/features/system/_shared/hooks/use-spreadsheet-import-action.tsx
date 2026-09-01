import type { SpreadsheetImportResult } from '@/api/common/import';
import type { DialogOptions } from '@/components/ui/dialog';
import { addDialog, closeDialog } from '@/components/ui/dialog';
import { errorMessage } from '@/services/feedback/message';
import SpreadsheetImportDialog from '@/features/system/_shared/components/SpreadsheetImportDialog.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

/** 导入面板对外暴露方法 */
export interface SpreadsheetImportDialogExpose {
  /** 提交导入（成功返回 `true`） */
  submitImport: () => Promise<boolean>;
}

/** 打开通用 Excel 导入弹窗参数 */
export interface SpreadsheetImportActionOptions {
  /** 导入接口 */
  onImport: (file: File) => Promise<SpreadsheetImportResult>;
  /** 模板下载接口 */
  onDownloadTemplate: () => Promise<Blob>;
  /** 模板文件名 */
  templateFilename: string;
  /** 导入成功后回调 */
  onSuccess?: () => Promise<void> | void;
}

/**
 * 通用 Excel 导入弹窗操作
 * @param options 导入弹窗参数
 * @returns `openImportDialog` 打开导入弹窗方法
 */
function useSpreadsheetImportAction(options: SpreadsheetImportActionOptions) {
  const { t } = useI18n();

  const openImportDialog = () => {
    const panelRef = ref<SpreadsheetImportDialogExpose | null>(null);

    const footerButtons: DialogOptions['footerButtons'] = [
      {
        label: t('buttons.close'),
        text: true,
        bg: true,
        btnClick: ({ dialog: { options: dialogOptions, index } }) => {
          closeDialog(dialogOptions, index, { command: 'close' });
        },
      },
      {
        label: t('import.submitButton'),
        type: 'primary',
        btnClick: async ({ dialog: { options: dialogOptions, index } }) => {
          try {
            const success = await panelRef.value?.submitImport();
            if (!success) {
              return;
            }
            await options.onSuccess?.();
            closeDialog(dialogOptions, index, { command: 'sure' });
          } catch (error: unknown) {
            errorMessage(error);
          }
        },
      },
    ];

    addDialog({
      title: t('import.dialogTitle'),
      width: '760px',
      draggable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      destroyOnClose: true,
      footerButtons,
      contentRenderer: () => (
        <SpreadsheetImportDialog
          ref={panelRef}
          onImport={options.onImport}
          onDownloadTemplate={options.onDownloadTemplate}
          templateFilename={options.templateFilename}
        />
      ),
    });
  };

  return {
    openImportDialog,
  };
}

export default useSpreadsheetImportAction;
