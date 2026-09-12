<script lang="ts" setup>
import { transformI18n } from '@/app/plugins/i18n';
import type { RouteConfigs } from '@/router/types';
import { computed } from 'vue';
import TagChrome from './TagChrome.vue';

import Close from '~icons/ep/close';

interface Props {
  item: RouteConfigs;
  index: number;
  showModel: string;
  active: boolean;
  fixed: boolean;
}

const props = defineProps<Props>();

defineEmits<{
  close: [];
}>();

const canClose = computed(() => !props.fixed && props.index !== 0);
const isChrome = computed(() => props.showModel === 'chrome');
</script>

<template>
  <div
    :data-tag-index="index"
    :class="['scroll-item', { 'is-active': active, 'fixed-tag': fixed, 'chrome-item': isChrome }]"
  >
    <template v-if="isChrome">
      <div class="chrome-tab">
        <div class="chrome-tab__bg">
          <TagChrome />
        </div>
        <span class="tag-title">
          {{ transformI18n(item.meta?.title) }}
        </span>
        <span v-if="canClose" class="chrome-close-btn" @click.stop="$emit('close')">
          <Close />
        </span>
        <span class="chrome-tab-divider" />
      </div>
    </template>
    <template v-else>
      <span class="tag-title">
        {{ transformI18n(item.meta?.title) }}
      </span>
      <span v-if="canClose" class="el-icon-close" @click.stop="$emit('close')">
        <Close />
      </span>
    </template>
  </div>
</template>
