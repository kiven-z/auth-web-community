<script lang="ts" setup>
import DeptSearchForm from '@/features/system/dept/components/DeptSearchForm.vue';
import DeptTableView from '@/features/system/dept/components/view/DeptTableView.vue';
import DeptTreeTableView from '@/features/system/dept/components/view/DeptTreeTableView.vue';
import DeptTreeView from '@/features/system/dept/components/view/DeptTreeView.vue';
import useDeptPageState from '@/features/system/dept/hooks/use-dept-page-state';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'SystemDept',
});

const { t } = useI18n();

const segmentedOptions = computed(() => [
  { label: t('dept.page.view.table'), value: 'table' as const },
  { label: t('dept.page.view.treeTable'), value: 'treeTable' as const },
  { label: t('dept.page.view.tree'), value: 'tree' as const },
]);

const { viewMode } = useDeptPageState();
</script>

<template>
  <div>
    <div class="flex flex-col">
      <el-segmented v-model="viewMode" :options="segmentedOptions" />
      <DeptSearchForm />
    </div>

    <DeptTableView v-if="viewMode === 'table'" />
    <DeptTreeTableView v-else-if="viewMode === 'treeTable'" />
    <DeptTreeView v-else />
  </div>
</template>
