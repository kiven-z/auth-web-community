/**
 * 根据 UA 粗判是否为移动端（仅作布局初始 device，非权威设备指纹）
 * @returns 是否像移动端；非浏览器环境返回 false
 */
export function deviceDetection(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }
  const userAgent = navigator.userAgent.toLowerCase();
  return (
    userAgent.includes('midp') ||
    userAgent.includes('ucweb') ||
    userAgent.includes('android') ||
    userAgent.includes('iphone os') ||
    userAgent.includes('windows ce') ||
    userAgent.includes('rv:1.2.3.4') ||
    userAgent.includes('windows mobile')
  );
}
