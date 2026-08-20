/** 按类型渲染的正文类型（含管理端 HTML 预览） */
export type TypedContentTypeCode = 'TEXT' | 'MARKDOWN' | 'HTML';

/** 按 contentType 展示正文 */
export interface TypedContentViewProps {
  /** 正文原文 */
  content?: string | null;
  /** 正文类型 */
  contentType: TypedContentTypeCode;
  /** 铺满父级宽度，且去掉默认内边距（站内信详情等全宽阅读场景） */
  fluid?: boolean;
}
