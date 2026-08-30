<script lang="ts" setup>
import type { SidebarMenuNode } from '@/router/types';
import { useLayoutCapabilities } from '@/layout/hooks/layout/useLayoutCapabilities';
import { MENU_TITLE_ROW_STYLE } from '@/layout/utils/menuPath';
import { resolveSubMenuIconMargin } from '@/layout/utils/sidebarStyle';
import { transformI18n } from '@/app/plugins/i18n';
import { useLayoutShellRuntimeStore } from '@/store/modules/layoutShellRuntime';
import SidebarLinkItem from './SidebarLinkItem.vue';
import { useRenderIcon } from '@/components/ui/Icon';
import { computed, type CSSProperties, type PropType, ref, toRaw, useAttrs } from 'vue';

const attrs = useAttrs();
const layoutShellStore = useLayoutShellRuntimeStore();
const { mode } = useLayoutCapabilities();
const isCollapse = computed(() => !layoutShellStore.sidebar.opened);
const getDivStyle = MENU_TITLE_ROW_STYLE;

const props = defineProps({
  item: {
    type: Object as PropType<SidebarMenuNode>,
  },
  isNest: {
    type: Boolean,
    default: false,
  },
  basePath: {
    type: String,
    default: '',
  },
});

const getNoDropdownStyle = computed((): CSSProperties => {
  return {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  };
});

const getSubMenuIconStyle = computed((): CSSProperties => {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: resolveSubMenuIconMargin(mode.value, isCollapse.value),
  };
});

const textClass = computed(() => {
  const item = props.item;
  const baseClass = 'w-full! text-inherit!';
  if (
    mode.value !== 'horizontal' &&
    isCollapse.value &&
    !toRaw(item.meta.icon) &&
    ((mode.value === 'vertical' && item.parentId === null) || (mode.value === 'mix' && item.pathList.length === 2))
  ) {
    return `${baseClass} min-w-[54px]! text-center! px-3!`;
  }
  return baseClass;
});

const onlyOneChild: SidebarMenuNode = ref(null);

function hasOneShowingChild(children: SidebarMenuNode[], parent: SidebarMenuNode) {
  const showingChildren = children.filter((item: any) => {
    onlyOneChild.value = item;
    return true;
  });

  if (showingChildren[0]?.meta?.showParent) {
    return false;
  }

  if (showingChildren.length === 1) {
    return true;
  }

  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true };
    return true;
  }
  return false;
}

/** 拼接菜单路由路径（替代 path-browserify，避免浏览器端 process 未定义） */
function resolvePath(routePath: string) {
  const httpReg = /^http(s?):\/\//;
  if (httpReg.test(routePath) || httpReg.test(props.basePath)) {
    return routePath || props.basePath;
  }
  if (!routePath) {
    return props.basePath;
  }
  if (routePath.startsWith('/')) {
    return routePath;
  }
  const base = props.basePath.replace(/\/+$/, '');
  return base ? `${base}/${routePath}` : `/${routePath}`;
}
</script>

<template>
  <SidebarLinkItem
    v-if="hasOneShowingChild(item.children ?? [], item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren)"
    :to="item"
  >
    <el-menu-item
      :class="{ 'layout-menu__title--leaf': !isNest }"
      :index="resolvePath(onlyOneChild.path)"
      :style="getNoDropdownStyle"
      v-bind="attrs"
    >
      <div v-if="toRaw(item.meta.icon)" :style="getSubMenuIconStyle" class="layout-menu__icon">
        <component :is="useRenderIcon(toRaw(onlyOneChild.meta.icon) || (item.meta && toRaw(item.meta.icon)))" />
      </div>
      <el-text
        v-if="
          (!item?.meta.icon && isCollapse && mode === 'vertical' && item?.pathList?.length === 1) ||
          (!onlyOneChild.meta.icon && isCollapse && mode === 'mix' && item?.pathList?.length === 2)
        "
        class="w-full! px-3! min-w-13.5! text-center! text-inherit!"
        truncated
      >
        {{ transformI18n(onlyOneChild.meta.title) }}
      </el-text>

      <template #title>
        <div :style="getDivStyle">
          <el-text class="w-full! text-inherit!" truncated>
            {{ transformI18n(onlyOneChild.meta.title) }}
          </el-text>
          <div v-if="onlyOneChild.meta.extraIcon" class="flex justify-center items-center">
            <component :is="useRenderIcon(toRaw(onlyOneChild.meta.extraIcon))" class="w-7.5 h-7.5" />
          </div>
        </div>
      </template>
    </el-menu-item>
  </SidebarLinkItem>
  <el-sub-menu v-else ref="subMenu" :index="resolvePath(item.path)" teleported>
    <template #title>
      <div v-if="toRaw(item.meta.icon)" :style="getSubMenuIconStyle" class="layout-menu__icon">
        <component :is="useRenderIcon(item.meta && toRaw(item.meta.icon))" />
      </div>
      <el-text
        v-if="
          mode === 'mix' && toRaw(item.meta.icon)
            ? !isCollapse || item?.pathList?.length !== 2
            : !(mode === 'vertical' && isCollapse && toRaw(item.meta.icon) && item.parentId === null)
        "
        :class="textClass"
        truncated
      >
        {{ transformI18n(item.meta.title) }}
      </el-text>
      <div v-if="!isCollapse && item.meta.extraIcon" class="flex justify-center items-center">
        <component :is="useRenderIcon(toRaw(item.meta.extraIcon))" class="w-7.5 h-7.5" />
      </div>
    </template>

    <sidebar-item
      v-for="child in item.children"
      :key="child.path"
      :base-path="resolvePath(child.path)"
      :is-nest="true"
      :item="child"
      class="layout-menu__nest"
    />
  </el-sub-menu>
</template>
