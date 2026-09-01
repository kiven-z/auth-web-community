<script lang="ts" setup>
import InAppCategoryTableView from '@/features/message/in-app-category/components/InAppCategoryTableView.vue';
import InAppCategoryTreeView from '@/features/message/in-app-category/components/InAppCategoryTreeView.vue';
import useInAppCategoryPageState from '@/features/message/in-app-category/hooks/use-in-app-category-page-state';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'InAppCategory',
});

const { t } = useI18n();

const segmentedOptions = computed(() => [
  { label: t('inAppCategory.page.view.table'), value: 'table' as const },
  { label: t('inAppCategory.page.view.tree'), value: 'tree' as const },
]);

const { viewMode } = useInAppCategoryPageState();
</script>

<template>
  <div>
    <div class="flex justify-center -mt-5 pb-1">
      <el-segmented v-model="viewMode" :options="segmentedOptions" />
    </div>

    <InAppCategoryTableView v-if="viewMode === 'table'" />
    <InAppCategoryTreeView v-else />
  </div>
</template>
