/** Blob 下载载荷（可选携带服务端 Content-Disposition 文件名） */
export interface BlobDownloadPayload {
  blob: Blob;
  filename?: string;
}

const UTF8_FILENAME_RE = /filename\*=UTF-8''([^;]+)/i;
const QUOTED_FILENAME_RE = /filename="([^"]+)"/i;
const PLAIN_FILENAME_RE = /filename=([^;]+)/i;

/**
 * 从 Content-Disposition 响应头解析 attachment 文件名
 * @param header Content-Disposition 原始值
 * @returns 解析出的文件名；无法解析时返回 undefined
 */
export function parseContentDispositionFilename(header: string | undefined | null): string | undefined {
  if (!header) {
    return undefined;
  }

  const utf8Match = UTF8_FILENAME_RE.exec(header);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1].trim());
    } catch {
      // 解码失败时继续尝试 filename=
    }
  }

  const quotedMatch = QUOTED_FILENAME_RE.exec(header);
  if (quotedMatch?.[1]) {
    return quotedMatch[1];
  }

  const plainMatch = PLAIN_FILENAME_RE.exec(header);
  if (plainMatch?.[1]) {
    return plainMatch[1].trim().replace(/^"(.*)"$/, '$1');
  }

  return undefined;
}

/**
 * 清洗下载文件名（去掉路径分隔与控制字符）
 * @param filename 原始文件名
 * @param fallback 空名时的回退
 * @returns 可安全用于 download 属性的文件名
 */
export function sanitizeDownloadFilename(filename: string | undefined | null, fallback = 'download'): string {
  const trimmed = filename?.trim();
  if (!trimmed) {
    return fallback;
  }
  const cleaned = Array.from(trimmed.replaceAll(/[/\\?%*:|"<>]/g, '_'))
    .filter((ch) => {
      const code = ch.codePointAt(0) ?? 0;
      return code > 0x1f && code !== 0x7f;
    })
    .join('');
  return cleaned.length > 0 ? cleaned : fallback;
}

/**
 * 触发浏览器下载 Blob 文件
 * @param blob 文件内容
 * @param filename 保存文件名
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = sanitizeDownloadFilename(filename);
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
