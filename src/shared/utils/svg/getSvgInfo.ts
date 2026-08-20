/** Iconify `addIcon` 所需的 SVG 解析结果 */
export interface SvgInfo {
  /** viewBox / width 解析出的宽度 */
  width: number;
  /** viewBox / height 解析出的高度 */
  height: number;
  /** `<svg>` 内部 HTML */
  body: string;
}

const EMPTY_SVG_INFO: SvgInfo = { width: 0, height: 0, body: '' };

function parseNumericAttr(value: string | null | undefined): number {
  if (!value) {
    return 0;
  }
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function parseViewBoxSize(viewBox: string | null): { width: number; height: number } {
  if (!viewBox) {
    return { width: 0, height: 0 };
  }
  const parts = viewBox.trim().split(/\s+/);
  if (parts.length < 4) {
    return { width: 0, height: 0 };
  }
  return {
    width: parseNumericAttr(parts[2]),
    height: parseNumericAttr(parts[3]),
  };
}

function resolveSvgSize(svgElement: SVGSVGElement): { width: number; height: number } {
  const fromViewBox = parseViewBoxSize(svgElement.getAttribute('viewBox'));
  const width = fromViewBox.width || parseNumericAttr(svgElement.getAttribute('width'));
  const height = fromViewBox.height || parseNumericAttr(svgElement.getAttribute('height'));
  return { width, height };
}

/**
 * 解析 SVG 字符串为 Iconify 离线图标所需结构
 * @param svgString SVG XML 字符串
 * @returns width / height / body；解析失败时返回空结构
 */
export function getSvgInfo(svgString: string): SvgInfo {
  if (typeof DOMParser === 'undefined') {
    return EMPTY_SVG_INFO;
  }
  try {
    const document = new DOMParser().parseFromString(svgString, 'image/svg+xml');
    if (document.querySelector('parsererror')) {
      return EMPTY_SVG_INFO;
    }
    const svgElement = document.querySelector('svg');
    if (!svgElement) {
      return EMPTY_SVG_INFO;
    }
    const { width, height } = resolveSvgSize(svgElement);
    return {
      width,
      height,
      body: svgElement.innerHTML || '',
    };
  } catch {
    return EMPTY_SVG_INFO;
  }
}
