<script lang="ts" setup>
import type { TagContextMenuItem } from '../../types';
import type { CSSProperties } from 'vue';

interface Props {
  visible: boolean;
  menuStyle: CSSProperties;
  tagsViews: Array<TagContextMenuItem>;
}

defineProps<Props>();
const emit = defineEmits<{
  select: [key: number, item: TagContextMenuItem];
}>();

/**
 * 右键菜单项点击
 * @param key 索引
 * @param item 菜单项
 */
function handleSelect(key: number, item: TagContextMenuItem): void {
  emit('select', key, item);
}
</script>

<template>
  <transition name="el-zoom-in-top">
    <ul v-show="visible" :style="menuStyle" class="tags-context-menu">
      <li
        v-for="(item, key) in tagsViews.slice(0, 6)"
        v-show="item.show"
        :key="key"
        class="tags-context-menu__item"
        @click="handleSelect(key, item)"
      >
        <IconifyIconOffline :icon="item.icon" />
        <slot :item="item" name="label">
          {{ item.text }}
        </slot>
      </li>
    </ul>
  </transition>
</template>

<style lang="scss" scoped>
.tags-context-menu {
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

  &__item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 7px 12px;
    margin: 0;
    cursor: pointer;

    &:hover {
      color: var(--el-color-primary);
    }

    svg {
      display: block;
      margin-right: 0.5em;
    }
  }
}
</style>
