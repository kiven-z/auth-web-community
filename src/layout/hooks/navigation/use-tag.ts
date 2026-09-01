import { computed, type CSSProperties, getCurrentInstance, onMounted, reactive, ref, unref } from 'vue';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import { useRoute, useRouter } from 'vue-router';
import type { TagContextMenuItem } from '@/layout/chrome/tags/types';
import { $t, transformI18n } from '@/app/plugins/i18n';
import { isFixedTagItem } from '@/layout/chrome/tags/utils/fixed-tag';
import { useLayoutShellRuntimeStore } from '@/store/modules/layout-shell-runtime';
import { useDisplayPreferencesStore } from '@/store/modules/preferences/display-preferences';
import { useTagsPreferencesStore } from '@/store/modules/preferences/tags/tags-preferences';
import { hasClass, toggleClass } from '@/shared/utils/dom/class-name';
import { storeToRefs } from 'pinia';
import isBoolean from 'lodash/isBoolean';
import isEqual from 'lodash/isEqual';

import Fullscreen from '~icons/ri/fullscreen-fill';
import CloseAllTags from '~icons/ri/subtract-line';
import CloseOtherTags from '~icons/ri/text-spacing';
import CloseRightTags from '~icons/ri/text-direction-l';
import CloseLeftTags from '~icons/ri/text-direction-r';
import RefreshRight from '~icons/ep/refresh-right';
import Close from '~icons/ep/close';

function conditionHandle(
  route: RouteLocationNormalizedLoaded,
  item: {
    name?: string;
    query?: Record<string, unknown>;
    params?: Record<string, unknown>;
    meta?: { showLink?: boolean };
  },
  previous: unknown,
  next: unknown
) {
  const currentName = route.name || '';
  const itemName = item.name || '';
  if (currentName !== itemName) {
    return next;
  }

  const hideFromMenu = isBoolean(route?.meta?.showLink) && route?.meta?.showLink === false;
  if (!hideFromMenu) {
    return previous;
  }

  const compareByQuery = Object.keys(route.query).length > 0;
  const matched = compareByQuery ? isEqual(route.query, item.query) : isEqual(route.params, item.params);
  return matched ? previous : next;
}

function checkIconIsActive(
  route: RouteLocationNormalizedLoaded,
  item: {
    name?: string;
    query?: Record<string, unknown>;
    params?: Record<string, unknown>;
    meta?: { showLink?: boolean };
  },
  index: number | string
) {
  if (Number(index) === 0) {
    return;
  }
  return conditionHandle(route, item, true, false);
}

function checkLinkIsActive(
  route: RouteLocationNormalizedLoaded,
  item: {
    name?: string;
    query?: Record<string, unknown>;
    params?: Record<string, unknown>;
    meta?: { showLink?: boolean };
  }
) {
  return conditionHandle(route, item, 'is-active', '');
}

function checkScheduleIsActive(
  route: RouteLocationNormalizedLoaded,
  item: {
    name?: string;
    query?: Record<string, unknown>;
    params?: Record<string, unknown>;
    meta?: { showLink?: boolean };
  }
) {
  return conditionHandle(route, item, 'schedule-active', '');
}

export function useTags() {
  const route = useRoute();
  const router = useRouter();
  const instance = getCurrentInstance();
  const layoutShellStore = useLayoutShellRuntimeStore();
  const displayStore = useDisplayPreferencesStore();
  const { showModel, hideTabs } = storeToRefs(displayStore);

  const buttonTop = ref(0);
  const buttonLeft = ref(0);
  const visible = ref(false);
  const activeIndex = ref(-1);
  const currentSelect = ref({});

  /** 是否隐藏标签页（true 则不渲染标签栏） */
  const showTags = computed(() => Boolean(hideTabs.value));
  const multiTags: any = computed(() => {
    return useTagsPreferencesStore().multiTags;
  });

  const tagsViews = reactive<Array<TagContextMenuItem>>([
    {
      icon: RefreshRight,
      text: $t('buttons.reload'),
      divided: false,
      disabled: false,
      show: true,
    },
    {
      icon: Close,
      text: $t('buttons.closeCurrentTab'),
      divided: false,
      disabled: multiTags.value.length <= 1,
      show: true,
    },
    {
      icon: CloseLeftTags,
      text: $t('buttons.closeLeftTabs'),
      divided: true,
      disabled: multiTags.value.length <= 1,
      show: true,
    },
    {
      icon: CloseRightTags,
      text: $t('buttons.closeRightTabs'),
      divided: false,
      disabled: multiTags.value.length <= 1,
      show: true,
    },
    {
      icon: CloseOtherTags,
      text: $t('buttons.closeOtherTabs'),
      divided: true,
      disabled: multiTags.value.length <= 2,
      show: true,
    },
    {
      icon: CloseAllTags,
      text: $t('buttons.closeAllTabs'),
      divided: false,
      disabled: multiTags.value.length <= 1,
      show: true,
    },
    {
      icon: Fullscreen,
      text: $t('buttons.contentFullScreen'),
      divided: true,
      disabled: false,
      show: true,
    },
  ]);

  const iconIsActive = computed(() => checkIconIsActive.bind(undefined, route));
  const linkIsActive = computed(() => checkLinkIsActive.bind(undefined, route));
  const scheduleIsActive = computed(() => checkScheduleIsActive.bind(undefined, route));

  const getContextMenuStyle = computed((): CSSProperties => {
    return { left: buttonLeft.value + 'px', top: buttonTop.value + 'px' };
  });

  const closeMenu = () => {
    visible.value = false;
  };

  /** 鼠标移入添加激活样式 */
  function onMouseenter(index) {
    if (index) activeIndex.value = index;
    if (unref(showModel) === 'smart') {
      if (hasClass(instance.refs['schedule' + index][0], 'schedule-active')) return;
      toggleClass(true, 'schedule-in', instance.refs['schedule' + index][0]);
      toggleClass(false, 'schedule-out', instance.refs['schedule' + index][0]);
    } else {
      if (hasClass(instance.refs['dynamic' + index][0], 'is-active')) return;
      toggleClass(true, 'card-in', instance.refs['dynamic' + index][0]);
      toggleClass(false, 'card-out', instance.refs['dynamic' + index][0]);
    }
  }

  /** 鼠标移出恢复默认样式 */
  function onMouseleave(index) {
    activeIndex.value = -1;
    if (unref(showModel) === 'smart') {
      if (hasClass(instance.refs['schedule' + index][0], 'schedule-active')) return;
      toggleClass(false, 'schedule-in', instance.refs['schedule' + index][0]);
      toggleClass(true, 'schedule-out', instance.refs['schedule' + index][0]);
    } else {
      if (hasClass(instance.refs['dynamic' + index][0], 'is-active')) return;
      toggleClass(false, 'card-in', instance.refs['dynamic' + index][0]);
      toggleClass(true, 'card-out', instance.refs['dynamic' + index][0]);
    }
  }

  function onContentFullScreen() {
    layoutShellStore.hiddenSideBar = !layoutShellStore.hiddenSideBar;
  }

  onMounted(() => {
    if (!showModel.value) {
      displayStore.setShowModel('card');
    }
  });

  return {
    Close,
    route,
    router,
    visible,
    showTags,
    instance,
    multiTags,
    showModel,
    tagsViews,
    buttonTop,
    buttonLeft,
    isFixedTag: isFixedTagItem,
    activeIndex,
    iconIsActive,
    linkIsActive,
    currentSelect,
    scheduleIsActive,
    getContextMenuStyle,
    $t,
    closeMenu,
    onMouseenter,
    onMouseleave,
    transformI18n,
    onContentFullScreen,
  };
}
