<script lang="ts" setup>
import { USER_DEPT_ALL_NODE_ID } from '@/features/system/user/constants/dept-tree';
import useUserPageState from '@/features/system/user/list/hooks/useUserPageState';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'UserDeptTreePanel',
});

const treeProps = {
  label: 'deptName',
  children: 'children',
} as const;

const { t } = useI18n();

const { treeKeyword, treeData, deptTreeLoading, currentNodeKey, loadDeptTree, handleDeptNodeClick } =
  useUserPageState();

onMounted(() => {
  loadDeptTree();
});
</script>

<template>
  <div class="user-dept-tree bg-auth-container">
    <div class="user-dept-tree__search p-2">
      <el-input v-model="treeKeyword" :placeholder="t('dept.placeholder.treeKeyword')" clearable />
    </div>

    <div v-loading="deptTreeLoading" class="user-dept-tree__body">
      <el-tree
        ref="treeRef"
        :current-node-key="currentNodeKey"
        :data="treeData"
        :expand-on-click-node="false"
        :props="treeProps"
        default-expand-all
        highlight-current
        node-key="id"
        @node-click="handleDeptNodeClick"
      >
        <template #default="{ node, data }">
          <span :title="node.label" class="block truncate text-sm">
            {{ data.id === USER_DEPT_ALL_NODE_ID ? t('users.filter.allDepts') : node.label }}
          </span>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-dept-tree {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;

  &__search {
    flex-shrink: 0;
  }

  &__body {
    flex: 1;
    min-height: 0;
    padding: 0 4px 8px;
    overflow: hidden auto;
  }
}
</style>
