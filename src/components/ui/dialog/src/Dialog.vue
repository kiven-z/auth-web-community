<script lang="ts" setup>
import isFunction from 'lodash/isFunction';
import { computed, nextTick, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ExitFullscreen from '~icons/ri/fullscreen-exit-fill';
import Fullscreen from '~icons/ri/fullscreen-fill';
import { closeDialog, confirmDialog, dialogStore, finalizeDialogClose } from '@/components/ui/dialog';
import { focusOverlayContent, OverlayConfirmScope, type OverlayContentExpose } from '@/components/ui/overlay';
import type { ButtonProps, DialogOptions, EventType } from './type';

defineOptions({
  name: 'AuthDialog',
});

const { t } = useI18n();
const fullscreen = ref(false);
/** 各弹层内容根节点（用于首焦） */
const bodyEls = ref<Array<HTMLElement | null>>([]);
/** 各弹层内容组件实例 */
const contentExposes = ref<Array<OverlayContentExpose | null>>([]);

const footerButtons = computed(() => {
  return (options: DialogOptions) => {
    return options?.footerButtons?.length > 0
      ? options.footerButtons
      : ([
          {
            label: t('buttons.close'),
            text: true,
            bg: true,
            btnClick: ({ dialog: { options, index } }) => {
              const done = () => closeDialog(options, index, { command: 'cancel' });
              if (options?.beforeCancel && isFunction(options?.beforeCancel)) {
                options.beforeCancel(done, { options, index });
              } else {
                done();
              }
            },
          },
          {
            label: t('buttons.confirm'),
            type: 'primary',
            text: true,
            bg: true,
            popconfirm: options?.popconfirm,
            btnClick: ({ dialog: { options, index } }) => {
              confirmDialog(options, index);
            },
          },
        ] as Array<ButtonProps>);
  };
});

const fullscreenClass = computed(() => {
  return ['el-icon', 'el-dialog__close', 'auth-dialog__fullscreen-icon', '-translate-x-2', 'cursor-pointer'];
});

function eventsCallBack(event: EventType, options: DialogOptions, index: number, isClickFullScreen = false) {
  if (!isClickFullScreen) fullscreen.value = options?.fullscreen ?? false;
  if (options?.[event] && isFunction(options?.[event])) {
    return options?.[event]({ options, index });
  }
}

function handleClose(options: DialogOptions, index: number) {
  finalizeDialogClose(options, index);
  eventsCallBack('close', options, index);
}

/**
 * 打开动画结束：业务 open 回调 + 可选首焦（此时 FocusTrap 已完成）
 */
function handleOpened(options: DialogOptions, index: number) {
  eventsCallBack('open', options, index);
  if (!options.focusOnOpen) {
    return;
  }
  void nextTick(() => {
    focusOverlayContent(bodyEls.value[index], contentExposes.value[index]);
  });
}

function bindBodyEl(index: number, el: Element | null) {
  bodyEls.value[index] = el instanceof HTMLElement ? el : null;
}

function bindContentExpose(index: number, el: unknown) {
  contentExposes.value[index] = (el as OverlayContentExpose | null) ?? null;
}
</script>

<template>
  <el-dialog
    v-for="(options, index) in dialogStore"
    :key="index"
    v-model="options.visible"
    :fullscreen="fullscreen ? true : options?.fullscreen"
    class="auth-dialog"
    v-bind="options"
    @closed="handleClose(options, index)"
    @opened="handleOpened(options, index)"
  >
    <template v-if="options?.fullscreenIcon || options?.headerRenderer" #header="{ close, titleId, titleClass }">
      <div v-if="options?.fullscreenIcon" class="flex items-center justify-between">
        <span :id="titleId" :class="titleClass">{{ options?.title }}</span>
        <i
          v-if="!options?.fullscreen"
          :class="fullscreenClass"
          @click="
            () => {
              fullscreen = !fullscreen;
              eventsCallBack('fullscreenCallBack', { ...options, fullscreen }, index, true);
            }
          "
        >
          <component
            :is="options?.fullscreen ? ExitFullscreen : fullscreen ? ExitFullscreen : Fullscreen"
            class="auth-dialog-svg"
          />
        </i>
      </div>
      <component :is="options?.headerRenderer({ close, titleId, titleClass })" v-else />
    </template>
    <div :ref="(el) => bindBodyEl(index, el as Element | null)">
      <OverlayConfirmScope
        :confirm="() => confirmDialog(options, index)"
        :enabled="Boolean(options.beforeSure && isFunction(options.beforeSure))"
      >
        <component
          :is="options.contentRenderer({ options, index })"
          :ref="(el: unknown) => bindContentExpose(index, el)"
          v-bind="options?.props"
        />
      </OverlayConfirmScope>
    </div>
    <template v-if="!options?.hideFooter" #footer>
      <template v-if="options?.footerRenderer">
        <component :is="options?.footerRenderer({ options, index })" />
      </template>
      <span v-else>
        <template v-for="(btn, key) in footerButtons(options)" :key="key">
          <el-popconfirm
            v-if="btn.popconfirm"
            v-bind="btn.popconfirm"
            @confirm="
              btn.btnClick({
                dialog: { options, index },
                button: { btn, index: key },
              })
            "
          >
            <template #reference>
              <el-button v-bind="btn">{{ btn?.label }}</el-button>
            </template>
          </el-popconfirm>
          <el-button
            v-else
            :loading="key === 1 && !!options.confirmLoading"
            v-bind="btn"
            @click="
              btn.btnClick({
                dialog: { options, index },
                button: { btn, index: key },
              })
            "
          >
            {{ btn?.label }}
          </el-button>
        </template>
      </span>
    </template>
  </el-dialog>
</template>
