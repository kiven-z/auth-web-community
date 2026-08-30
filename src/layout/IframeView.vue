<script lang="ts" setup>
import { transformI18n } from '@/app/plugins/i18n';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { computed, nextTick, onMounted, ref, unref, watch } from 'vue';

defineOptions({
  name: 'IframeView',
});

const props = defineProps<{
  frameInfo?: {
    frameSrc?: string;
    fullPath?: string;
  };
}>();

const { t } = useI18n();
const loading = ref(true);
const currentRoute = useRoute();
const frameSrc = ref<string>('');
const frameRef = ref<HTMLElement | null>(null);
const fallbackTimer = ref<ReturnType<typeof setTimeout> | null>(null);
const iframeTitle = computed(() => {
  const title = unref(currentRoute.meta)?.title;
  if (title) {
    return transformI18n(title);
  }
  return t('menus.menuTypeIframe');
});

if (unref(currentRoute.meta)?.frameSrc) {
  frameSrc.value = unref(currentRoute.meta)?.frameSrc as string;
}

function clearFallbackTimer() {
  if (fallbackTimer.value !== null) {
    clearTimeout(fallbackTimer.value);
    fallbackTimer.value = null;
  }
}

function hideLoading() {
  loading.value = false;
  clearFallbackTimer();
}

function init() {
  nextTick(() => {
    const iframe = unref(frameRef);
    if (!iframe) return;
    const _frame = iframe as any;
    if (_frame.attachEvent) {
      _frame.attachEvent('onload', hideLoading);
    } else {
      iframe.onload = hideLoading;
    }
  });
}

let isRedirect = false;

watch(
  () => currentRoute.fullPath,
  (path) => {
    if (currentRoute.name === 'Redirect' && props.frameInfo?.fullPath && path.includes(props.frameInfo.fullPath)) {
      isRedirect = true;
      loading.value = true;
      return;
    }
    if (props.frameInfo?.fullPath === path && isRedirect) {
      loading.value = true;
      clearFallbackTimer();
      const url = new URL(props.frameInfo.frameSrc, globalThis.location.origin);
      const joinChar = url.search ? '&' : '?';
      frameSrc.value = `${props.frameInfo.frameSrc}${joinChar}t=${Date.now()}`;
      fallbackTimer.value = globalThis.setTimeout(() => {
        if (loading.value) {
          hideLoading();
        }
      }, 1500);
      isRedirect = false;
    }
  },
  { immediate: true }
);

onMounted(() => {
  init();
});
</script>

<template>
  <div v-loading="loading" :element-loading-text="t('status.loading')" class="layout-frame">
    <iframe ref="frameRef" :src="frameSrc" :title="iframeTitle" class="layout-frame__iframe" />
  </div>
</template>

<style lang="scss" scoped>
.layout-frame {
  position: absolute;
  inset: 0;

  .layout-frame__iframe {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 0;
  }
}

.layout__page {
  margin: 2px 0 0 !important;
}
</style>
