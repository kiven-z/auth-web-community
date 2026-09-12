<script lang="ts" setup>
import { type TagContextMenuItem, TagMenuAction } from './constants/tag-menu';
import { transformI18n } from '@/app/plugins/i18n';
import type { CSSProperties, FunctionalComponent } from 'vue';

import CloseAllTags from '~icons/ri/subtract-line';
import CloseOtherTags from '~icons/ri/text-spacing';
import CloseRightTags from '~icons/ri/text-direction-l';
import CloseLeftTags from '~icons/ri/text-direction-r';
import RefreshRight from '~icons/ep/refresh-right';
import Close from '~icons/ep/close';
import Fullscreen from '~icons/ri/fullscreen-fill';
import ExitFullscreen from '~icons/ri/fullscreen-exit-fill';

interface Props {
  visible: boolean;
  menuStyle: CSSProperties;
  items: TagContextMenuItem[];
}

defineProps<Props>();
const emit = defineEmits<{
  select: [action: TagMenuAction];
}>();

const MENU_ICONS: Record<TagMenuAction, FunctionalComponent> = {
  [TagMenuAction.Reload]: RefreshRight,
  [TagMenuAction.Close]: Close,
  [TagMenuAction.CloseLeft]: CloseLeftTags,
  [TagMenuAction.CloseRight]: CloseRightTags,
  [TagMenuAction.CloseOther]: CloseOtherTags,
  [TagMenuAction.CloseAll]: CloseAllTags,
  [TagMenuAction.Fullscreen]: Fullscreen,
};

/**
 * 菜单项图标（全屏按文案切换进入/退出）
 * @param item 可见菜单项
 * @returns 图标组件
 */
function iconOf(item: TagContextMenuItem): FunctionalComponent {
  if (item.action === TagMenuAction.Fullscreen && item.labelKey === 'buttons.contentExitFullScreen') {
    return ExitFullscreen;
  }
  return MENU_ICONS[item.action];
}
</script>

<template>
  <transition name="el-zoom-in-top">
    <ul v-show="visible" :style="menuStyle" class="layout-tags__context-menu">
      <li
        v-for="item in items"
        :key="item.action"
        :class="['layout-tags__context-menu-item', { 'is-divided': item.divided }]"
        @click="emit('select', item.action)"
      >
        <component :is="iconOf(item)" />
        {{ transformI18n(item.labelKey) }}
      </li>
    </ul>
  </transition>
</template>

<style lang="scss" scoped>
.layout-tags__context-menu {
  position: absolute;
  padding: 5px 0;
  margin: 0;
  font-size: 13px;
  font-weight: normal;
  color: var(--el-text-color-primary);
  white-space: nowrap;
  outline: 0;
  list-style-type: none;
  background: var(--el-bg-color);
  border-radius: var(--auth-radius-extra-large);
  box-shadow: var(--auth-shadow-1);

  &-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 7px 12px;
    margin: 0;
    cursor: pointer;

    &:hover {
      color: var(--el-color-primary);
    }

    &.is-divided {
      margin-top: 4px;
      border-top: 1px solid var(--el-border-color-lighter);
    }

    svg {
      display: block;
      margin-right: 0.5em;
    }
  }
}
</style>
