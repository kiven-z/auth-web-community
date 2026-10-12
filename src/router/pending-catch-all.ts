import { defineComponent } from 'vue';
import type { RouteRecordRaw } from 'vue-router';

/** 动态路由尚未注册时的占位名，注册完成后由 404 替换 */
export const ROUTE_PENDING_NAME = 'RoutePending';

const RoutePendingView = defineComponent({
  name: 'RoutePendingView',
  render() {
    return null;
  },
});

/**
 * 启动时兜住尚未注册的动态路径，避免刷新业务页时出现无匹配警告。
 * 不展示 404；动态路由注册完成后移除。
 */
export const pendingCatchAll: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: ROUTE_PENDING_NAME,
  component: RoutePendingView,
  meta: {
    title: '',
    showLink: false,
  },
};
