/** 头像更新卡片属性 */
export interface AvatarUpdateCardProps {
  /** 当前头像 URL */
  avatar?: string | null;
  /** AvatarEditor 尺寸 */
  size?: number;
  /** 上传成功后持久化头像（由调用方注入 me / admin API） */
  persist: (avatarUrl: string) => Promise<void>;
}
