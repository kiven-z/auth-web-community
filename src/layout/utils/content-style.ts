/** {@link resolveLayContentSectionStyle} 入参 */
interface LayContentSectionStyleInput {
  /** 是否隐藏标签栏 */
  hideTabs: boolean;
  /** 标签栏展示模型（chrome / smart 等） */
  showModel: string;
  /** 是否固定顶栏 */
  fixedHeader: boolean;
}

/**
 * 解析内容区主栏最大宽度
 * @param stretch 偏好中的 stretch：数字为固定像素，true 为 1440，其余为 100%
 */
export function resolveLayContentMainWidth(stretch: number | boolean | undefined): string {
  if (typeof stretch === 'number') {
    return `${stretch}px`;
  }
  if (stretch) {
    return '1440px';
  }
  return '100%';
}

/**
 * 解析内容区 section 内联样式片段（固定顶栏 padding / 滚动模式 min-height）
 * @param input 标签栏与顶栏状态
 */
export function resolveLayContentSectionStyle(input: LayContentSectionStyleInput): string[] {
  if (!input.fixedHeader) {
    const minHeight = input.hideTabs ? 'min-height: calc(100vh - 48px);' : 'min-height: calc(100vh - 86px);';
    return [`padding-top: 0;${minHeight}`];
  }

  if (input.hideTabs) {
    return ['padding-top: 48px;'];
  }
  if (input.showModel === 'chrome') {
    return ['padding-top: 85px;'];
  }
  return ['padding-top: 81px;'];
}
