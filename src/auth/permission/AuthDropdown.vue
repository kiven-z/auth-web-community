<script lang="ts" setup>
import { hasAuth } from '@/auth/permission/hasAuth';
import type { AuthDropdownItem } from '@/auth/permission/types';
import { computed } from 'vue';

defineOptions({
  name: 'AuthDropdown',
  inheritAttrs: false,
});

const props = defineProps<{
  items: AuthDropdownItem[];
}>();

const visibleItems = computed(() =>
  props.items.filter((item) => {
    if (item.show === false) {
      return false;
    }
    if (!item.permission) {
      return true;
    }
    return hasAuth(item.permission, item.mode ?? 'all');
  })
);

function onCommand(index: string | number | object) {
  const item = visibleItems.value[Number(index)];
  item?.onClick();
}
</script>

<template>
  <el-dropdown v-if="visibleItems.length > 0" trigger="click" v-bind="$attrs" @command="onCommand">
    <slot />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="(item, index) in visibleItems"
          :key="index"
          :command="index"
          :disabled="item.disabled"
          :divided="item.divided"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
