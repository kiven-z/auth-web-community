import type { PageResponse } from '@/api/common/page';

/**
 * 授权面分页面板公共入参（各主体面板按行/查询类型具体化）
 */
export interface AuthorizationSurfacePanelProps<TRow, TQuery> {
  title: string;
  queryPerm: string;
  fetchPage: (query: TQuery) => Promise<PageResponse<TRow>>;
}

/** 授权面摘要计数项 */
export interface DetailRelationCountItem {
  /** 展示文案（调用方已 i18n） */
  label: string;
  /** 关联数量 */
  count: number | null | undefined;
}

/** 已分配种子：id + 展示文案，灌入 v-model 与 label 缓存 */
export interface AssignSeedItem {
  key: string;
  label: string;
}

/** 行展示文案，由业务注入 */
export type AssignGetRowLabel = (row: Record<string, unknown>) => string;

/** 踢出用户全部会话的可选配置 */
export interface KickAllForUserOptions {
  /** 成功后回调（如刷新会话列表） */
  onSuccess?: () => void | Promise<void>;
  /** 成功提示 i18n key */
  successI18nKey?: string;
}
