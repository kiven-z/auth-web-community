import { transformI18n } from '@/app/plugins/i18n';
import { addDialog, type ButtonProps, closeDialog, type DialogOptions } from '@/components/ui/Dialog';
import { ref } from 'vue';
import type { ImageCropperPanelExpose, OpenImageCropDialogOptions } from './types';
import ImageCropperPanel from './ImageCropperPanel.vue';

/**
 * 打开图片裁剪弹窗
 * @param options 裁剪弹窗参数
 */
export function openImageCropDialog(options: OpenImageCropDialogOptions): void {
  const {
    title = transformI18n('imageCropper.defaultTitle'),
    imageUrl,
    aspectRatio = 1,
    exportSize = 512,
    cropOptions,
    maxHeight = '420px',
    labels,
    onConfirm,
    onCancel,
  } = options;

  const panelRef = ref<ImageCropperPanelExpose | null>(null);
  const confirming = ref(false);

  /**
   * 设置操作按钮的禁用状态
   * @param isDisabled 是否禁用
   */
  const setActionButtonsDisabled = (isDisabled: boolean) => {
    footerButtons[0].disabled = isDisabled;
    footerButtons[1].disabled = isDisabled;
    footerButtons[2].disabled = isDisabled;
  };

  const footerButtons: DialogOptions['footerButtons'] = [
    {
      label: labels.cancel,
      text: true,
      bg: true,
      disabled: confirming.value,
      btnClick: ({ dialog: { options: dialogOptions, index } }) => {
        if (confirming.value) {
          return;
        }
        onCancel?.();
        closeDialog(dialogOptions, index, { command: 'cancel' });
      },
    },
    {
      label: labels.reset,
      text: true,
      bg: true,
      disabled: confirming.value,
      btnClick: () => {
        if (confirming.value) {
          return;
        }
        panelRef.value?.resetCropper();
      },
    },
    {
      label: labels.confirm,
      type: 'primary',
      btnClick: async ({ dialog: { options: dialogOptions, index } }) => {
        if (confirming.value) {
          return;
        }
        const blob = await panelRef.value?.getCroppedBlob();
        if (!blob) {
          return;
        }

        confirming.value = true;
        setActionButtonsDisabled(true);

        try {
          await onConfirm(blob);
          closeDialog(dialogOptions, index, { command: 'sure' });
        } catch {
          // 保持弹窗打开，由调用方处理错误提示
        } finally {
          confirming.value = false;
          setActionButtonsDisabled(false);
        }
      },
    },
  ] as Array<ButtonProps>;

  addDialog({
    title,
    width: '560px',
    closeOnClickModal: false,
    closeOnPressEscape: true,
    destroyOnClose: true,
    footerButtons,
    beforeClose(done) {
      if (confirming.value) {
        return;
      }
      onCancel?.();
      done();
    },
    closeCallBack({ args }) {
      if (args?.command === 'close' && !confirming.value) {
        onCancel?.();
      }
    },
    contentRenderer() {
      return (
        <ImageCropperPanel
          ref={panelRef}
          imageUrl={imageUrl}
          aspectRatio={aspectRatio}
          exportSize={exportSize}
          cropOptions={cropOptions}
          maxHeight={maxHeight}
          labels={{ empty: labels.empty, hint: labels.hint }}
          loading={confirming}
        />
      );
    },
  });
}
