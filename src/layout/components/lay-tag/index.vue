<script lang="ts" setup>
import { onClickOutside, useResizeObserver } from '@vueuse/core';
import { useTags } from '@/layout/hooks/navigation/useTag';
import { delay } from '@/shared/utils/async/delay';
import { computed, nextTick, onMounted as vueOnMounted, ref, watch } from 'vue';
import TagChrome from './components/TagChrome.vue';
import TagsContextMenu from './TagsContextMenu.vue';
import { useTagsBar } from './hooks/useTagsBar';
import { useTagsScroll } from './hooks/useTagsScroll';
import { useTagsSortable } from './hooks/useTagsSortable';
import { findTagIndex, getTagItemKey } from './utils/tagIdentity';
import { navigateToTag } from './utils/tagNavigate';

import ArrowDown from '~icons/ri/arrow-down-s-line';
import ArrowLeftSLine from '~icons/ri/arrow-left-s-line';
import ArrowRightSLine from '~icons/ri/arrow-right-s-line';

defineOptions({
  name: 'LayTag',
});

const {
  Close,
  route,
  router,
  visible,
  showTags,
  instance,
  multiTags,
  tagsViews,
  buttonTop,
  buttonLeft,
  showModel,
  isFixedTag,
  activeIndex,
  iconIsActive,
  linkIsActive,
  currentSelect,
  scheduleIsActive,
  getContextMenuStyle,
  closeMenu,
  onMouseenter,
  onMouseleave,
  transformI18n,
  onContentFullScreen,
} = useTags();

const tabDom = ref<HTMLElement>();
const containerDom = ref();
const scrollbarDom = ref<HTMLDivElement>();
const contextmenuRef = ref();
const isShowArrow = ref(false);
const tagsSortableEnabled = computed(() => !showTags.value);

const { syncArrowVisible, scrollTagIntoView, scrollByArrow, handleWheel } = useTagsScroll({
  scrollbarRef: scrollbarDom,
  tabListRef: tabDom,
  isShowArrow,
  getTagElement(index) {
    const refValue = instance?.refs[`dynamic${index}`];
    if (!refValue) {
      return undefined;
    }
    return (Array.isArray(refValue) ? refValue[0] : refValue) as HTMLElement;
  },
});

useTagsSortable(tabDom, tagsSortableEnabled);

/**
 * 路由变化后滚动激活标签并刷新箭头
 */
async function dynamicTagView(): Promise<void> {
  await nextTick();
  const index = findTagIndex(multiTags.value, {
    path: route.path,
    query: route.query,
    params: route.params,
  });
  await scrollTagIntoView(index);
}

const { deleteMenu, handleCommand, selectTag, openMenu, syncTagsWithRoute, initTagsFromRoute } = useTagsBar({
  route,
  router,
  multiTags,
  tagsViews,
  currentSelect: currentSelect as never,
  visible,
  buttonTop,
  buttonLeft,
  containerDom,
  closeMenu,
  onContentFullScreen,
  dynamicTagView,
});

onClickOutside(contextmenuRef, closeMenu, {
  detectIframe: true,
});

watch(route, () => {
  activeIndex.value = -1;
  void dynamicTagView();
  syncTagsWithRoute();
});

vueOnMounted(() => {
  if (!instance) {
    return;
  }
  initTagsFromRoute();
  useResizeObserver(scrollbarDom, () => {
    syncArrowVisible();
    void dynamicTagView();
  });
  delay().then(() => dynamicTagView());
});
</script>

<template>
  <div v-if="!showTags" ref="containerDom" class="tags-view">
    <span v-show="isShowArrow" class="arrow-left">
      <IconifyIconOffline :icon="ArrowLeftSLine" @click="scrollByArrow(-1)" />
    </span>
    <div
      ref="scrollbarDom"
      :class="showModel === 'chrome' && 'chrome-scroll-container'"
      class="scroll-container"
      @wheel.prevent="handleWheel"
    >
      <div ref="tabDom" class="tab select-none">
        <div
          v-for="(item, index) in multiTags"
          :key="getTagItemKey(item)"
          :ref="'dynamic' + index"
          :class="[
            'scroll-item',
            linkIsActive(item),
            showModel === 'chrome' && 'chrome-item',
            isFixedTag(item) && 'fixed-tag',
          ]"
          @click="navigateToTag(router, item)"
          @contextmenu.prevent="openMenu(item, $event)"
          @mouseenter.prevent="onMouseenter(index)"
          @mouseleave.prevent="onMouseleave(index)"
        >
          <template v-if="showModel !== 'chrome'">
            <span class="tag-title dark:text-auth-text! dark:hover:text-primary!">
              {{ transformI18n(item.meta.title) }}
            </span>
            <span
              v-if="isFixedTag(item) ? false : iconIsActive(item, index) || (index === activeIndex && index !== 0)"
              class="el-icon-close"
              @click.stop="deleteMenu(item)"
            >
              <IconifyIconOffline :icon="Close" />
            </span>
            <span v-if="showModel !== 'card'" :ref="'schedule' + index" :class="[scheduleIsActive(item)]" />
          </template>
          <div v-else class="chrome-tab">
            <div class="chrome-tab__bg">
              <TagChrome />
            </div>
            <span class="tag-title">
              {{ transformI18n(item.meta.title) }}
            </span>
            <span v-if="isFixedTag(item) ? false : index !== 0" class="chrome-close-btn" @click.stop="deleteMenu(item)">
              <IconifyIconOffline :icon="Close" />
            </span>
            <span class="chrome-tab-divider" />
          </div>
        </div>
      </div>
    </div>
    <span v-show="isShowArrow" class="arrow-right">
      <IconifyIconOffline :icon="ArrowRightSLine" @click="scrollByArrow(1)" />
    </span>

    <div ref="contextmenuRef">
      <TagsContextMenu :menu-style="getContextMenuStyle" :tags-views="tagsViews" :visible="visible" @select="selectTag">
        <template #label="{ item }">
          {{ transformI18n(item.text) }}
        </template>
      </TagsContextMenu>
    </div>

    <el-dropdown placement="bottom-end" trigger="click" @command="handleCommand">
      <span class="arrow-down">
        <IconifyIconOffline :icon="ArrowDown" class="dark:text-white" />
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="(item, key) in tagsViews"
            :key="key"
            :command="{ key, item }"
            :disabled="item.disabled"
            :divided="item.divided"
          >
            <IconifyIconOffline :icon="item.icon" />
            {{ transformI18n(item.text) }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped>
@import url('./index.scss');
</style>
