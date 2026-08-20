const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'ftp:', 'rtsp:', 'mms:', 'ws:', 'wss:']);
const LOCALHOST = 'localhost';
const IPV4_WITH_LEADING_NONZERO_FIRST_OCTET = /^[1-9]\d{0,2}(?:\.\d{1,3}){3}$/;
const IPV6_DOLLAR_HOST_PATTERN = /^\$[0-9a-fA-F:]+\$$/;
const DOMAIN_LABEL_PATTERN = /^[a-zA-Z0-9-_]+$/;
const DOMAIN_TLD_PATTERN = /^[a-zA-Z]{2,63}$/;

/**
 * 判断字符串是否为 URL（含可选协议、localhost、IP、域名）
 * @param value 待检测字符串
 * @returns 是否像 URL
 */
export function isUrl(value: string): boolean {
  const input = value?.trim();
  if (!input) return false;

  // 旧实现不接受相对路径等
  if (input.startsWith('/') || input.startsWith('?') || input.startsWith('#')) return false;

  // 快速拦截：空白字符不应被当作 URL
  if (/\s/.test(input)) return false;

  const hasProtocol = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(input);
  const toParse = hasProtocol ? input : `http://${input}`;

  // 解析：显式协议用原样；无协议则视为 host[:port]/path 的形式
  let url: URL;
  try {
    url = new URL(toParse);
  } catch {
    return false;
  }

  // 例如 javascript:... 必须拒绝
  if (!ALLOWED_PROTOCOLS.has(url.protocol)) return false;

  const host = url.hostname;
  if (!host) return false;

  // 本域名和无协议的 "$...$" 形式
  if (host === LOCALHOST) return true;
  if (IPV6_DOLLAR_HOST_PATTERN.test(input)) return true;

  // IPv4 形式
  if (IPV4_WITH_LEADING_NONZERO_FIRST_OCTET.test(host)) return true;

  // 域名形式（要求至少一个 '.'，且 TLD 长度 2-63）
  const parts = host.split('.');
  if (parts.length < 2) return false;

  const tld = parts.at(-1);
  if (!tld || !DOMAIN_TLD_PATTERN.test(tld)) return false;

  const labels = parts.slice(0, -1);
  return labels.length > 0 && labels.every((label) => DOMAIN_LABEL_PATTERN.test(label));
}

/**
 * 通过临时 `<a>` 打开外链（默认新标签，带 noopener）
 * @param href 链接地址
 * @param target 打开目标，默认 `_blank`
 */
export function openLink(href: string, target = '_blank'): void {
  if (typeof document === 'undefined') {
    return;
  }
  const anchor = document.createElement('a');
  anchor.setAttribute('href', href);
  anchor.setAttribute('target', target);
  anchor.setAttribute('rel', 'noreferrer noopener');
  anchor.setAttribute('id', 'external');
  const existing = document.getElementById('external');
  if (existing) {
    existing.remove();
  }
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
