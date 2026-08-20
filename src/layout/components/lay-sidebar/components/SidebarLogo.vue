<script lang="ts" setup>
import { getAppTitle, getLogoUrl } from '@/layout/utils/platform';
import { getTopMenu } from '@/router/utils/misc';

defineProps({
  collapse: Boolean,
});

const title = getAppTitle();
const logoUrl = getLogoUrl();
</script>

<template>
  <div :class="['sidebar-logo', { 'sidebar-logo--collapsed': collapse }]">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        :title="title"
        :to="getTopMenu()?.path ?? '/'"
        class="sidebar-logo__link"
      >
        <img :src="logoUrl" alt="logo" />
        <span class="sidebar-logo__title">{{ title }}</span>
      </router-link>
      <router-link v-else key="expand" :title="title" :to="getTopMenu()?.path ?? '/'" class="sidebar-logo__link">
        <img :src="logoUrl" alt="logo" />
        <span class="sidebar-logo__title">{{ title }}</span>
      </router-link>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-logo {
  position: relative;
  width: 100%;
  height: 48px;
  overflow: hidden;

  .sidebar-logo__link {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    height: 100%;
    padding: 0 0 0 10px;

    img {
      display: inline-block;
      height: 32px;
      margin: 5px 0 0;
    }

    .sidebar-logo__title {
      display: inline-block;
      height: 32px;
      margin: 2px 0 0 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 18px;
      font-weight: 600;
      line-height: 32px;
      color: var(--auth-theme-chrome-text);
      white-space: nowrap;
    }
  }
}
</style>
