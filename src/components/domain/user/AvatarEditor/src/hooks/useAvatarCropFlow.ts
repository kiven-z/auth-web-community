import { uploadFile } from '@/features/file/api/fileUpload';
import { openImageCropDialog } from '@/components/ui/ImageCropper';
import { errorMessage, message } from '@/services/feedback/message';
import { validateUploadFile } from '@/shared/utils/file/validateUploadFile';
import type { UploadFile, UploadInstance, UploadRawFile } from 'element-plus';
import { onBeforeUnmount, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const AVATAR_MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_AVATAR_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** 头像裁剪上传流程配置 */
interface UseAvatarCropFlowOptions {
  /** 上传成功后的回调 */
  onAvatarUploaded: (avatarUrl: string) => void | Promise<void>;
  /** 是否在回调成功后展示默认成功提示，默认 true */
  showSuccessMessage?: boolean;
}

/**
 * 管理头像选择、裁剪、上传与清理流程状态
 * @param options 头像流程配置
 * @returns 头像流程状态与交互处理函数
 */
export function useAvatarCropFlow(options: UseAvatarCropFlowOptions) {
  const { onAvatarUploaded, showSuccessMessage = true } = options;
  const { t } = useI18n();

  const avatarUploadRef = ref<UploadInstance>();
  const avatarUploading = ref(false);
  const avatarCropping = ref(false);
  const avatarCropperImageUrl = ref('');
  const pendingAvatarRawFile = ref<UploadRawFile | null>(null);

  /**
   * 撤销头像裁剪图片 URL
   */
  const revokeAvatarCropperImageUrl = () => {
    if (avatarCropperImageUrl.value) {
      URL.revokeObjectURL(avatarCropperImageUrl.value);
      avatarCropperImageUrl.value = '';
    }
  };

  /**
   * 取消头像裁剪并清理状态
   */
  const handleAvatarCropCancel = (): void => {
    revokeAvatarCropperImageUrl();
    pendingAvatarRawFile.value = null;
    avatarUploadRef.value?.clearFiles();
  };

  /**
   * 选择头像后进入裁剪流程
   * @param upload 上传文件信息
   */
  async function handleAvatarChange(upload: UploadFile): Promise<void> {
    if (!upload.raw || avatarUploading.value || avatarCropping.value) {
      return;
    }

    const rawFile = upload.raw;

    const isValid = validateUploadFile(rawFile, {
      allowedMimeTypes: ALLOWED_AVATAR_MIME_TYPES,
      maxSizeBytes: AVATAR_MAX_FILE_SIZE_BYTES,
      onTypeInvalid: () => errorMessage(null, { message: t('account.avatar.fileTypeInvalid') }),
      onSizeExceeded: () => errorMessage(null, { message: t('account.avatar.fileSizeExceeded') }),
    });
    if (!isValid) {
      avatarUploadRef.value?.clearFiles();
      return;
    }

    revokeAvatarCropperImageUrl();
    pendingAvatarRawFile.value = rawFile;
    avatarCropperImageUrl.value = URL.createObjectURL(rawFile);

    openImageCropDialog({
      title: t('account.avatar.cropper.title'),
      imageUrl: avatarCropperImageUrl.value,
      aspectRatio: 1,
      exportSize: 512,
      labels: {
        cancel: t('imageCropper.cancel'),
        reset: t('imageCropper.reset'),
        confirm: t('imageCropper.confirmUpload'),
        empty: t('imageCropper.empty'),
        hint: t('account.avatar.cropper.hint'),
      },
      onCancel: handleAvatarCropCancel,
      onConfirm: async (croppedBlob: Blob) => {
        if (!pendingAvatarRawFile.value || avatarUploading.value) {
          return;
        }

        avatarCropping.value = true;
        avatarUploading.value = true;

        try {
          const file = new File([croppedBlob], 'avatar-cropped.png', { type: 'image/png' });
          const uploaded = await uploadFile({ file, bizType: 'avatar' });
          await onAvatarUploaded(uploaded.url);
          if (showSuccessMessage) {
            message(t('tips.operationSuccess'), { type: 'success' });
          }
          handleAvatarCropCancel();
        } catch (error: unknown) {
          errorMessage(error);
          throw error;
        } finally {
          avatarCropping.value = false;
          avatarUploading.value = false;
        }
      },
    });
  }

  onBeforeUnmount(() => {
    revokeAvatarCropperImageUrl();
    pendingAvatarRawFile.value = null;
  });

  return {
    avatarUploadRef,
    avatarUploading,
    avatarCropping,
    handleAvatarChange,
  };
}
