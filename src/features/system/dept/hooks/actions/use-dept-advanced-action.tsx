import type { DialogOptions } from '@/components/ui/dialog';
import { addDialog, closeDialog } from '@/components/ui/dialog';
import DeptClosureHealthDialog from '@/features/system/dept/components/tools/DeptClosureHealthDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface ClosureHealthDialogExpose {
  reload: () => Promise<void>;
}

/**
 * 部门工具栏「高级功能」
 * @returns 闭包健康检查入口
 */
function useDeptAdvancedAction() {
  const { t } = useI18n();

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
    openClosureHealthDialog,
  };
}

export default useDeptAdvancedAction;
