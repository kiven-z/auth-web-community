import { useTimeoutFn } from '@vueuse/core';
import isFunction from 'lodash/isFunction';
import { ref } from 'vue';
import { runOverlayBeforeSure } from '@/components/ui/Overlay';
import { withInstall } from '@/shared/vue/withInstall';
import reDrawer from './src/Drawer.vue';
import type { ArgsType, DrawerOptions } from './src/type';

export type { ArgsType, ButtonProps, DrawerOptions, DrawerProps, EventType } from './src/type';

type DrawerStoreItem = DrawerOptions & {
  _closeArgs?: ArgsType;
  _finalizeScheduled?: boolean;
};

const drawerStore = ref<Array<DrawerStoreItem>>([]);

/** 打开抽屉 */
const addDrawer = (options: DrawerOptions) => {
  const open = () => drawerStore.value.push(Object.assign(options, { visible: true }));
  if (options?.openDelay) {
    useTimeoutFn(() => {
      open();
    }, options.openDelay);
  } else {
    open();
  }
};

/** 发起关闭：仅置 visible=false，清理在动画结束后的 finalizeDrawerClose */
const closeDrawer = (options: DrawerOptions, index: number, args?: ArgsType) => {
  const item = drawerStore.value[index];
  if (!item?.visible) {
    return;
  }
  item._closeArgs = args ?? { command: 'close' };
  item.visible = false;
};

/** 关闭动画结束后：回调 + 从 store 移除（@closed 唯一入口） */
const finalizeDrawerClose = (options: DrawerOptions, index: number) => {
  const item = drawerStore.value[index];
  if (!item || item._finalizeScheduled) {
    return;
  }
  item._finalizeScheduled = true;

  const args = item._closeArgs ?? { command: 'close' };
  options.closeCallBack?.({ options, index, args });

  const closeDelay = options?.closeDelay ?? 200;
  useTimeoutFn(() => {
    const currentIndex = drawerStore.value.indexOf(item);
    if (currentIndex !== -1) {
      drawerStore.value.splice(currentIndex, 1);
    }
  }, closeDelay);
};

/**
 * 触发确定：loading → beforeSure → done/closeLoading
 * 内容区表单通过 `useOverlayConfirm` + `v-enter-submit` 触发此入口
 */
const confirmDrawer = (options: DrawerOptions, index: number) => {
  const loadingEnabled = options.confirmLoadingEnabled ?? Boolean(options.beforeSure);
  if (options?.beforeSure && isFunction(options.beforeSure)) {
    runOverlayBeforeSure({
      beforeSure: options.beforeSure,
      loadingEnabled,
      setConfirmLoading: (loading) => {
        options.confirmLoading = loading;
      },
      onDone: () => closeDrawer(options, index, { command: 'sure' }),
      options,
      index,
    });
    return;
  }
  closeDrawer(options, index, { command: 'sure' });
};

/**
 * @description 更改抽屉自身属性值
 * @param value 属性值
 * @param key 属性，默认`title`
 * @param index 弹框索引（默认`0`，代表只有一个弹框，对于嵌套弹框要改哪个弹框的属性值就把该弹框索引赋给`index`）
 */
const updateDrawer = (value: any, key = 'title', index = 0) => {
  drawerStore.value[index][key] = value;
};

/** 关闭所有弹框 */
const closeAllDrawer = () => {
  drawerStore.value = [];
};

const AuthDrawer = withInstall(reDrawer);

export {
  AuthDrawer,
  drawerStore,
  addDrawer,
  closeDrawer,
  confirmDrawer,
  finalizeDrawerClose,
  updateDrawer,
  closeAllDrawer,
};
