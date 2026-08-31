<script lang="ts" setup>
import isFunction from 'lodash/isFunction';
import { computed, nextTick, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { closeDrawer, confirmDrawer, drawerStore, finalizeDrawerClose } from '@/components/ui/Drawer';
import { focusOverlayContent, OverlayConfirmScope, type OverlayContentExpose } from '@/components/ui/Overlay';
import type { ButtonProps, DrawerOptions, EventType } from './type';

defineOptions({
  name: 'AuthDrawer',
});

const { t } = useI18n();
/** 各抽屉内容根节点（用于首焦） */
const bodyEls = ref<Array<HTMLElement | null>>([]);
/** 各抽屉内容组件实例 */
const contentExposes = ref<Array<OverlayContentExpose | null>>([]);

const footerButtons = computed(() => {
  return (options: DrawerOptions) => {
    return options?.footerButtons?.length > 0
      ? options.footerButtons
      : ([
          {
            label: t('buttons.close'),
            text: true,
            bg: true,
            btnClick: ({ drawer: { options, index } }) => {
              const done = () => closeDrawer(options, index, { command: 'cancel' });
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
            popConfirm: options?.popConfirm,
            btnClick: ({ drawer: { options, index } }) => {
              confirmDrawer(options, index);
            },
          },
        ] as Array<ButtonProps>);
  };
});

function eventsCallBack(event: EventType, options: DrawerOptions, index: number) {
  if (options?.[event] && isFunction(options?.[event])) {
    return options?.[event]({ options, index });
  }
}

/**
 * @param options 抽屉配置
 * @param index 抽屉索引
 */
function handleClose(options: DrawerOptions, index: number) {
  finalizeDrawerClose(options, index);
  eventsCallBack('close', options, index);
}

/**
 * 打开动画结束：业务 open 回调 + 可选首焦（此时 FocusTrap 已完成）
 */
function handleOpened(options: DrawerOptions, index: number) {
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
  <el-drawer
    v-for="(options, index) in drawerStore"
    :key="index"
    v-model="options.visible"
    :append-to="options?.appendTo ? options.appendTo : 'body'"
    :append-to-body="!!options?.appendToBody"
    :destroy-on-close="!!options?.destroyOnClose"
    :lock-scroll="!!options?.lockScroll"
    class="auth-drawer"
    v-bind="options"
    @closed="handleClose(options, index)"
    @opened="handleOpened(options, index)"
  >
    <template v-if="options?.headerRenderer" #header="{ close, titleId, titleClass }">
      <component :is="options?.headerRenderer({ close, titleId, titleClass })" />
    </template>
    <div :ref="(el) => bindBodyEl(index, el as Element | null)" class="auth-drawer__content">
      <OverlayConfirmScope
        :confirm="() => confirmDrawer(options, index)"
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
            v-if="btn.popConfirm"
            v-bind="btn.popConfirm"
            @confirm="
              btn.btnClick({
                drawer: { options, index },
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
                drawer: { options, index },
                button: { btn, index: key },
              })
            "
          >
            {{ btn?.label }}
          </el-button>
        </template>
      </span>
    </template>
  </el-drawer>
</template>

<style lang="scss">
/** 定高内容区：表体 fill，滚动发生在表格内部而非抽屉 body */
.el-drawer.auth-drawer--fill {
  .el-drawer__body {
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
  }

  .auth-drawer__content {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
  }
}
</style>
