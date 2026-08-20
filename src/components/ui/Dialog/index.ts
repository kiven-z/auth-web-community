import { useTimeoutFn } from '@vueuse/core';
import isFunction from 'lodash/isFunction';
import { ref } from 'vue';
import { runOverlayBeforeSure } from '@/components/ui/Overlay';
import { withInstall } from '@/shared/vue/withInstall';
import reDialog from './src/Dialog.vue';
import type { ArgsType, DialogOptions } from './src/type';

export type { ArgsType, ButtonProps, DialogOptions, DialogProps, EventType } from './src/type';

type DialogStoreItem = DialogOptions & {
  _closeArgs?: ArgsType;
  _finalizeScheduled?: boolean;
};

const dialogStore = ref<Array<DialogStoreItem>>([]);

/** 打开弹框 */
const addDialog = (options: DialogOptions) => {
  const open = () => dialogStore.value.push(Object.assign(options, { visible: true }));
  if (options?.openDelay) {
    useTimeoutFn(() => {
      open();
    }, options.openDelay);
  } else {
    open();
  }
};

/** 发起关闭：仅置 visible=false，清理在动画结束后的 finalizeDialogClose */
const closeDialog = (options: DialogOptions, index: number, args?: ArgsType) => {
  const item = dialogStore.value[index];
  if (!item?.visible) {
    return;
  }
  item._closeArgs = args ?? { command: 'close' };
  item.visible = false;
};

/** 关闭动画结束后：回调 + 从 store 移除（@closed 唯一入口） */
const finalizeDialogClose = (options: DialogOptions, index: number) => {
  const item = dialogStore.value[index];
  if (!item || item._finalizeScheduled) {
    return;
  }
  item._finalizeScheduled = true;

  const args = item._closeArgs ?? { command: 'close' };
  options.closeCallBack?.({ options, index, args });

  const closeDelay = options?.closeDelay ?? 200;
  useTimeoutFn(() => {
    const currentIndex = dialogStore.value.indexOf(item);
    if (currentIndex !== -1) {
      dialogStore.value.splice(currentIndex, 1);
    }
  }, closeDelay);
};

/**
 * 触发确定：loading → beforeSure → done/closeLoading
 * 内容区表单通过 `useOverlayConfirm` + `v-enter-submit` 触发此入口
 */
const confirmDialog = (options: DialogOptions, index: number) => {
  const loadingEnabled = options.confirmLoadingEnabled ?? Boolean(options.beforeSure);
  if (options?.beforeSure && isFunction(options.beforeSure)) {
    runOverlayBeforeSure({
      beforeSure: options.beforeSure,
      loadingEnabled,
      setConfirmLoading: (loading) => {
        options.confirmLoading = loading;
      },
      onDone: () => closeDialog(options, index, { command: 'sure' }),
      options,
      index,
    });
    return;
  }
  closeDialog(options, index, { command: 'sure' });
};

/**
 * @description 更改弹框自身属性值
 * @param value 属性值
 * @param key 属性，默认`title`
 * @param index 弹框索引（默认`0`，代表只有一个弹框，对于嵌套弹框要改哪个弹框的属性值就把该弹框索引赋给`index`）
 */
const updateDialog = (value: any, key = 'title', index = 0) => {
  dialogStore.value[index][key] = value;
};

/** 关闭所有弹框 */
const closeAllDialog = () => {
  dialogStore.value = [];
};

const AuthDialog = withInstall(reDialog);

export {
  AuthDialog,
  dialogStore,
  addDialog,
  closeDialog,
  confirmDialog,
  finalizeDialogClose,
  updateDialog,
  closeAllDialog,
};
