import { computed, type MaybeRefOrGetter, type Ref, ref, toValue } from 'vue';
import { onBeforeRouteUpdate, type RouteLocationNormalized } from 'vue-router';

import type { WorkspaceNavGroup } from '../types';

const ANIMATE_PREFIX = 'animate__animated';

/** 往下切：轻量淡出上移 / 淡入上移 */
const DOWN_ENTER = `${ANIMATE_PREFIX} animate__fadeInUp`;
const DOWN_LEAVE = `${ANIMATE_PREFIX} animate__fadeOutUp`;

/** 往上切：轻量淡出下移 / 淡入下移 */
const UP_ENTER = `${ANIMATE_PREFIX} animate__fadeInDown`;
const UP_LEAVE = `${ANIMATE_PREFIX} animate__fadeOutDown`;

/**
 * 读取路由 meta.section 作为侧栏分区键
 * @param route 路由
 * @param fallback 缺省分区
 */
function readSection(route: RouteLocationNormalized, fallback: string): string {
  const section = route.meta.section;
  return typeof section === 'string' && section ? section : fallback;
}

/**
 * 按侧栏菜单顺序推导分区切换方向，产出 animate.css 进/离场类
 * @param navGroups 可见侧栏分组
 * @param defaultSection 路由未声明 section 时的回退键
 * @returns enter / leave active class
 */
export function useWorkspaceSectionTransition(
  navGroups: MaybeRefOrGetter<WorkspaceNavGroup[]>,
  defaultSection: MaybeRefOrGetter<string>
): {
  enterActiveClass: Ref<string>;
  leaveActiveClass: Ref<string>;
} {
  const enterActiveClass = ref(DOWN_ENTER);
  const leaveActiveClass = ref(DOWN_LEAVE);

  const sectionOrder = computed(() => toValue(navGroups).flatMap((group) => group.items.map((item) => item.key)));

  onBeforeRouteUpdate((to, from) => {
    const fallback = toValue(defaultSection);
    const fromSection = readSection(from, fallback);
    const toSection = readSection(to, fallback);
    if (fromSection === toSection) {
      return;
    }

    const fromIndex = sectionOrder.value.indexOf(fromSection);
    const toIndex = sectionOrder.value.indexOf(toSection);
    if (fromIndex < 0 || toIndex < 0) {
      return;
    }

    const goingDown = toIndex > fromIndex;
    enterActiveClass.value = goingDown ? DOWN_ENTER : UP_ENTER;
    leaveActiveClass.value = goingDown ? DOWN_LEAVE : UP_LEAVE;
  });

  return { enterActiveClass, leaveActiveClass };
}
