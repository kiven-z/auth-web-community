<script lang="ts" setup>
import MenuSearchForm from '@/features/system/menu/components/MenuSearchForm.vue';
import MenuElTreeView from '@/features/system/menu/components/view/MenuElTreeView.vue';
import MenuTableView from '@/features/system/menu/components/view/MenuTableView.vue';
import MenuTreeTableView from '@/features/system/menu/components/view/MenuTreeTableView.vue';
import useMenuPageState from '@/features/system/menu/hooks/use-menu-page-state';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'SystemMenu',
});

const { t } = useI18n();

const segmentedOptions = computed(() => [
  { label: t('sysMenu.viewTableTitle'), value: 'table' as const },
  { label: t('sysMenu.viewTreeTableTitle'), value: 'treeTable' as const },
  { label: t('sysMenu.viewTreeTitle'), value: 'tree' as const },
]);

const { viewMode } = useMenuPageState();
</script>

<template>
  <div>
    <div class="flex flex-col">
      <el-segmented v-model="viewMode" :options="segmentedOptions" />
      <MenuSearchForm />
    </div>

    <MenuTableView v-if="viewMode === 'table'" />
    <MenuTreeTableView v-else-if="viewMode === 'treeTable'" />
    <MenuElTreeView v-else />
  </div>
</template>
