import type { MaybeRef } from 'vue';

/** cropperjs 裁剪选项（`aspectRatio` 由 props 注入） */
export interface ImageCropperCropOptions {
  viewMode?: number;
  dragMode?: 'crop' | 'move' | 'none';
  autoCropArea?: number;
  background?: boolean;
  guides?: boolean;
  movable?: boolean;
  zoomable?: boolean;
  cropBoxMovable?: boolean;
  cropBoxResizable?: boolean;
  responsive?: boolean;
}

/** 裁剪面板空态与提示文案 */
export interface ImageCropperLabels {
  /** 未选择图片时的空态描述 */
  empty: string;
  /** 裁剪操作提示 */
  hint: string;
}

/** 图片裁剪面板 Props */
export interface ImageCropperPanelProps {
  /** 待裁剪图片地址 */
  imageUrl: string;
  /** 裁剪框宽高比，默认 1 */
  aspectRatio?: number;
  /** 导出图片边长（宽），默认 512 */
  exportSize?: number;
  /** cropperjs 额外选项（`aspectRatio` 由 props 注入） */
  cropOptions?: ImageCropperCropOptions;
  /** 裁剪区域最大高度，默认 420px */
  maxHeight?: string;
  /** 空态与提示文案 */
  labels: ImageCropperLabels;
  /** 是否显示加载遮罩 */
  loading?: MaybeRef<boolean>;
}

/** 裁剪面板对外暴露方法 */
export interface ImageCropperPanelExpose {
  /**
   * 获取裁剪后的图片 Blob
   * @returns 裁剪结果，失败时返回 `null`
   */
  getCroppedBlob: () => Promise<Blob | null>;
  /** 重置裁剪区域 */
  resetCropper: () => void;
}

/** 打开裁剪弹窗时的文案 */
export interface OpenImageCropDialogLabels extends ImageCropperLabels {
  /** 取消按钮 */
  cancel: string;
  /** 重置按钮 */
  reset: string;
  /** 确认按钮 */
  confirm: string;
}

/** 打开图片裁剪弹窗参数 */
export interface OpenImageCropDialogOptions {
  /** 弹窗标题，缺省使用 `imageCropper.defaultTitle` */
  title?: string;
  /** 待裁剪图片地址 */
  imageUrl: string;
  /** 裁剪框宽高比，默认 1 */
  aspectRatio?: number;
  /** 导出图片边长（宽），默认 512 */
  exportSize?: number;
  /** cropperjs 额外选项 */
  cropOptions?: ImageCropperCropOptions;
  /** 裁剪区域最大高度，默认 420px */
  maxHeight?: string;
  /** 弹窗与面板文案 */
  labels: OpenImageCropDialogLabels;
  /**
   * 确认裁剪回调；抛出异常时弹窗保持打开
   * @param blob 裁剪结果
   */
  onConfirm: (blob: Blob) => Promise<void> | void;
  /** 取消或关闭弹窗回调 */
  onCancel?: () => void;
}
