import { addDialog, closeDialog } from '@/components/ui/Dialog';
import { getInAppMessageCategoryById, type InAppMessageCategoryOption } from '@/features/message/api/in-app-category';
import type { InAppComposeRequest } from '@/features/message/api/in-app-message';
import InAppHistoryImportDialog from '@/features/message/compose/components/InAppHistoryImportDialog.vue';
import InAppTemplateImportDialog from '@/features/message/compose/components/InAppTemplateImportDialog.vue';
import type { InAppComposeImportPayload } from '@/features/message/compose/types/compose-import';
import { multiConfirm } from '@/services/feedback/dialog';
import { errorMessage } from '@/services/feedback/message';
import type { Ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface UseInAppComposeImportOptions {
  form: InAppComposeRequest;
  majorCategoryId: Ref<string | undefined>;
  subOptions: Ref<InAppMessageCategoryOption[]>;
  loadSubs: (majorId: string) => Promise<void>;
  loadMajors: () => Promise<void>;
}

/**
 * 撰写页模板 / 历史发送导入弹窗
 * @param options 撰写表单与分类级联状态
 * @returns 打开导入弹窗的方法
 */
function useInAppComposeImport(options: UseInAppComposeImportOptions) {
  const { form, majorCategoryId, subOptions, loadSubs, loadMajors } = options;
  const { t } = useI18n();

  /**
   * 确认后将导入结果写入撰写表单
   * @param payload 导入载荷
   * @returns 是否已导入
   */
  const confirmAndApplyImport = async (payload: InAppComposeImportPayload) => {
    const confirmed = await multiConfirm([
      {
        title: t('inAppCompose.importConfirmTitle'),
        message: t('inAppCompose.importConfirmMessage'),
      },
    ]);
    if (!confirmed) {
      return false;
    }

    form.templateCode = payload.templateCode;
    form.title = payload.title;
    form.body = payload.body;
    form.contentType = payload.contentType;
    form.linkUrl = payload.linkUrl;

    if (payload.categoryId) {
      try {
        const minor = await getInAppMessageCategoryById(payload.categoryId);
        const parentId = minor.parentId;
        if (parentId && parentId !== '0') {
          await loadMajors();
          majorCategoryId.value = parentId;
          await loadSubs(parentId);
        }
        form.categoryId = payload.categoryId;
      } catch (error: unknown) {
        errorMessage(error);
        form.categoryId = undefined;
      }
    } else {
      majorCategoryId.value = undefined;
      subOptions.value = [];
      form.categoryId = undefined;
    }

    return true;
  };

  /**
   * 打开模板导入弹窗
   */
  function openTemplateImportDialog(): void {
    addDialog({
      title: t('inAppCompose.importTemplateDialogTitle'),
      width: '90%',
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      hideFooter: true,
      contentRenderer: ({ options: dialogOptions, index }) => (
        <InAppTemplateImportDialog
          onImport={async (payload: InAppComposeImportPayload) => {
            const imported = await confirmAndApplyImport(payload);
            if (imported) {
              closeDialog(dialogOptions, index, { command: 'close' });
            }
          }}
        />
      ),
    });
  }

  /**
   * 打开历史发送导入弹窗
   */
  function openHistoryImportDialog(): void {
    addDialog({
      title: t('inAppCompose.importHistoryDialogTitle'),
      width: '90%',
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      hideFooter: true,
      contentRenderer: ({ options: dialogOptions, index }) => (
        <InAppHistoryImportDialog
          onImport={async (payload: InAppComposeImportPayload) => {
            const imported = await confirmAndApplyImport(payload);
            if (imported) {
              closeDialog(dialogOptions, index, { command: 'close' });
            }
          }}
        />
      ),
    });
  }

  return {
    openTemplateImportDialog,
    openHistoryImportDialog,
  };
}

export default useInAppComposeImport;
