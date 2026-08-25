import type { UploadRawFile } from 'element-plus';

/** 上传文件校验选项 */
interface ValidateUploadFileOptions {
  /** 允许的 MIME 类型 */
  allowedMimeTypes: string[];
  /** 最大文件大小（字节） */
  maxSizeBytes: number;
  /** 类型不合法时的回调 */
  onTypeInvalid: () => void;
  /** 超出大小限制时的回调 */
  onSizeExceeded: () => void;
}

/**
 * 校验上传文件类型与大小
 * @param file 待校验文件
 * @param options 校验规则与失败回调
 * @returns 是否通过校验
 */
export function validateUploadFile(file: File | UploadRawFile, options: ValidateUploadFileOptions): boolean {
  const { allowedMimeTypes, maxSizeBytes, onTypeInvalid, onSizeExceeded } = options;

  if (!allowedMimeTypes.includes(file.type)) {
    onTypeInvalid();
    return false;
  }

  if (file.size > maxSizeBytes) {
    onSizeExceeded();
    return false;
  }

  return true;
}
