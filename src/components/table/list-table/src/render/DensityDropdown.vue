<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import DensityIcon from '~icons/ri/line-height';

import { LIST_TABLE_DENSITY_OPTIONS, LIST_TABLE_ICON_CLASS, type ListTableDensity } from '../constants';
import { tippyOptions } from '../utils/tippy-options';

defineOptions({ name: 'DensityDropdown' });

const size = defineModel<ListTableDensity>('size', { required: true });

const { t } = useI18n();

const getItemStyle = computed(() => {
  return (densitySize: ListTableDensity) => ({
    background: densitySize === size.value ? 'var(--el-color-primary)' : '',
    color: densitySize === size.value ? '#fff' : 'var(--el-text-color-primary)',
  });
});
</script>

<template>
  <el-dropdown v-tippy="tippyOptions(t, 'listTable.tippyDensity')" trigger="click">
    <IconifyIconOffline :class="['w-4', LIST_TABLE_ICON_CLASS]" :icon="DensityIcon" />
    <template #dropdown>
      <el-dropdown-menu class="translation">
        <el-dropdown-item
          v-for="option in LIST_TABLE_DENSITY_OPTIONS"
          :key="option.value"
          :style="getItemStyle(option.value)"
          @click="size = option.value"
        >
          {{ t(option.labelKey) }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
