import { getInAppInboxUnreadCount, type InAppInboxMajorUnread } from '@/features/message/api/in-app-inbox';
import { defineStore } from 'pinia';

interface InAppInboxState {
  /** 未读总数 */
  totalUnreadCount: number;
  /** 启用大类列表 */
  majors: InAppInboxMajorUnread[];
  /** 大类 / 未读角标加载中 */
  loadingMajors: boolean;
}

export const useInAppInboxStore = defineStore('in-app-inbox', {
  state: (): InAppInboxState => ({
    totalUnreadCount: 0,
    majors: [],
    loadingMajors: false,
  }),
  actions: {
    /**
     * 从服务端刷新未读角标与大类 Tab 数据（附属请求失败时静默，保持 0 / 空列表）
     */
    async refreshUnreadCount() {
      if (this.majors.length === 0) {
        this.loadingMajors = true;
      }

      try {
        const unreadCount = await getInAppInboxUnreadCount();
        this.totalUnreadCount = unreadCount.totalUnreadCount ?? 0;
        this.majors = unreadCount.majors ?? [];
      } catch {
        // 角标失败不影响主流程，不弹窗
      } finally {
        this.loadingMajors = false;
      }
    },
  },
});
