/** {@link resolveContentSectionPaddingTop} 入参 */
interface ContentSectionPaddingInput {
  /** 是否隐藏标签栏 */
  hideTabs: boolean;
  /** 标签栏展示模型（chrome / smart 等） */
  showModel: string;
  /** 内容区全屏（顶栏 Navbar 已隐藏，仅可能保留标签栏） */
  contentFullscreen?: boolean;
}

/**
 * 解析内容区顶栏预留高度（写入 --layout-content-padding-top）
 * @param input 标签栏 / 全屏状态
 */
export function resolveContentSectionPaddingTop(input: ContentSectionPaddingInput): string {
  if (input.contentFullscreen) {
    return input.hideTabs ? '0px' : '32px';
  }
  if (input.hideTabs) {
    return '48px';
  }
  if (input.showModel === 'chrome') {
    return '85px';
  }
  return '81px';
}
