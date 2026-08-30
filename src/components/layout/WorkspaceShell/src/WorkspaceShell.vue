<script lang="ts" setup>
import { UserAvatar } from '@/components/domain/user/UserProfile';
import { useRenderIcon } from '@/components/ui/Icon';
import { getMenuTooltipEffect } from '@/shared/utils/platform';
import { ArrowLeft, DArrowLeft, DArrowRight } from '@element-plus/icons-vue';
import 'animate.css';
import { ref, toRef } from 'vue';
import { useI18n } from 'vue-i18n';

import { useWorkspaceSectionTransition } from './hooks/useWorkspaceSectionTransition';
import type { WorkspaceNavGroup } from './types';

defineOptions({
  name: 'WorkspaceShell',
});

const props = withDefaults(
  defineProps<{
    /** 头像 URL */
    avatar?: string | null;
    /** 侧栏主名称 */
    displayName: string;
    /** 侧栏副标题 */
    subtitle?: string;
    /** 副标题为空时的提示文案（如加载失败） */
    subtitleHint?: string;
    /** 当前激活分区键（通常来自 route.meta.section） */
    activeSection: string;
    /** 侧栏分组 */
    navGroups: WorkspaceNavGroup[];
    /** 返回按钮文案 */
    backLabel: string;
    /** 根节点 loading */
    loading?: boolean;
    /** 菜单强制重挂载 key（嵌套路由需刷新 default-active 时传入） */
    menuRemountKey?: string | number;
  }>(),
  {
    avatar: null,
    subtitle: '',
    subtitleHint: '',
    loading: false,
    menuRemountKey: undefined,
  }
);

const emit = defineEmits<{
  back: [];
  select: [section: string];
}>();

const { t } = useI18n();
const tooltipEffect = getMenuTooltipEffect();
const sidebarCollapsed = ref(false);

const { enterActiveClass, leaveActiveClass } = useWorkspaceSectionTransition(
  toRef(props, 'navGroups'),
  toRef(props, 'activeSection')
);
</script>

<template>
  <div v-loading="loading" class="workspace-shell">
    <aside :class="['workspace-shell__sidebar', { 'workspace-shell__sidebar--collapsed': sidebarCollapsed }]">
      <div class="workspace-shell__profile">
        <UserAvatar
          :avatar="avatar"
          :name="displayName"
          :size="sidebarCollapsed ? 32 : 44"
          class="workspace-shell__avatar"
        />
        <div v-show="!sidebarCollapsed" class="workspace-shell__identity">
          <div :title="displayName" class="workspace-shell__name">{{ displayName }}</div>
          <div v-if="subtitle" :title="subtitle" class="workspace-shell__subtitle">{{ subtitle }}</div>
          <div v-else-if="subtitleHint" class="workspace-shell__subtitle">{{ subtitleHint }}</div>
        </div>
      </div>

      <el-scrollbar class="workspace-shell__scroll">
        <el-menu
          :key="menuRemountKey ?? 'workspace-menu'"
          :collapse="sidebarCollapsed"
          :collapse-transition="false"
          :default-active="activeSection"
          :popper-effect="tooltipEffect"
          class="workspace-shell__menu"
          @select="(index: string) => emit('select', index)"
        >
          <el-menu-item-group v-for="group in navGroups" :key="group.key" :title="sidebarCollapsed ? '' : group.title">
            <el-menu-item v-for="item in group.items" :key="item.key" :index="item.key">
              <div class="workspace-shell__menu-icon">
                <component :is="useRenderIcon(item.icon)" />
              </div>
              <template #title>
                <span class="workspace-shell__menu-title">{{ item.label }}</span>
              </template>
            </el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </el-scrollbar>

      <div class="workspace-shell__footer">
        <button class="workspace-shell__footer-btn" type="button" @click="emit('back')">
          <el-icon class="workspace-shell__footer-icon"><ArrowLeft /></el-icon>
          <span v-show="!sidebarCollapsed" class="workspace-shell__footer-label">{{ backLabel }}</span>
        </button>
        <button class="workspace-shell__footer-btn" type="button" @click="sidebarCollapsed = !sidebarCollapsed">
          <el-icon class="workspace-shell__footer-icon">
            <DArrowRight v-if="sidebarCollapsed" />
            <DArrowLeft v-else />
          </el-icon>
          <span v-show="!sidebarCollapsed" class="workspace-shell__footer-label">
            {{ t('buttons.clickCollapse') }}
          </span>
        </button>
      </div>
    </aside>

    <main class="workspace-shell__main">
      <!-- key 用侧栏分区，忽略 query / 同分区嵌套（如 inbox 详情），避免误触发上下过场 -->
      <router-view v-slot="{ Component }">
        <Transition :enter-active-class="enterActiveClass" :leave-active-class="leaveActiveClass" mode="out-in">
          <div :key="activeSection" class="workspace-shell__panel">
            <component :is="Component" />
          </div>
        </Transition>
      </router-view>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use './styles/workspace-shell';
</style>
