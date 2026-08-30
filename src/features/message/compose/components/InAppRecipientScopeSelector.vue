<script lang="ts" setup>
import { InAppRecipientScopeType } from '@/features/message/api/inAppMessage';
import { getDeptList } from '@/features/system/api/dept/dept';
import { errorMessage } from '@/services/feedback/message';
import useRemotePostSearch from '@/components/domain/post/RemotePostSearch';
import useRemoteUserSearch from '@/components/domain/user/RemoteUserSearch';
import { buildDeptSelectTree, type DeptSelectTreeNode } from '@/components/domain/dept/DeptSelectTree';
import type { CascaderProps } from 'element-plus';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'InAppRecipientScopeSelector',
});

const recipientScopeType = defineModel<InAppRecipientScopeType>('recipientScopeType', { required: true });
const recipientScopeIds = defineModel<string[]>('recipientScopeIds', { required: true });
const includeChildren = defineModel<boolean>('includeChildren', { required: true });

const { t } = useI18n();

const deptTree = ref<DeptSelectTreeNode[]>([]);
const deptTreeLoading = ref(false);

const { userOptions, userSearchLoading, loadUserListByKeyword } = useRemoteUserSearch({
  limit: 50,
});

const { postOptions, postSearchLoading, loadPostListByKeyword } = useRemotePostSearch();

const deptCascaderProps: CascaderProps = {
  multiple: true,
  checkStrictly: true,
  emitPath: false,
  value: 'value',
  label: 'label',
  children: 'children',
  disabled: 'disabled',
};

const showScopeIds = computed(() => recipientScopeType.value !== 'ALL');

const scopeSegmentedOptions = computed(() => [
  { label: t('inAppCompose.scope.user'), value: 'USER' as const },
  { label: t('inAppCompose.scope.post'), value: 'POST' as const },
  { label: t('inAppCompose.scope.dept'), value: 'DEPT' as const },
  { label: t('inAppCompose.scope.all'), value: 'ALL' as const },
]);

/**
 * 加载部门树（启用节点；计算无效则 disabled，与 requireEffective 选型一致）
 */
async function loadDeptTree(): Promise<void> {
  deptTreeLoading.value = true;
  try {
    const list = await getDeptList({ status: true });
    deptTree.value = buildDeptSelectTree(list ?? []);
  } catch (error: unknown) {
    errorMessage(error);
    deptTree.value = [];
  } finally {
    deptTreeLoading.value = false;
  }
}

watch(recipientScopeType, () => {
  recipientScopeIds.value = [];
});

onMounted(() => {
  loadDeptTree();
});
</script>

<template>
  <div class="in-app-recipient-scope-selector">
    <el-form-item :label="t('inAppCompose.recipientScope')" prop="recipientScopeType">
      <el-segmented v-model="recipientScopeType" :options="scopeSegmentedOptions" class="w-full" />
    </el-form-item>

    <el-form-item
      v-if="recipientScopeType === 'USER' && showScopeIds"
      :label="t('inAppCompose.selectUsers')"
      prop="recipientScopeIds"
    >
      <el-select
        v-model="recipientScopeIds"
        :loading="userSearchLoading"
        :placeholder="t('inAppCompose.placeholder.selectUsers')"
        :remote-method="loadUserListByKeyword"
        class="w-full"
        clearable
        filterable
        multiple
        remote
      >
        <el-option
          v-for="item in userOptions"
          :key="item.id"
          :label="item.nickname ? `${item.username}(${item.nickname})` : item.username"
          :value="item.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      v-if="recipientScopeType === 'POST' && showScopeIds"
      :label="t('inAppCompose.selectPosts')"
      prop="recipientScopeIds"
    >
      <el-select
        v-model="recipientScopeIds"
        :loading="postSearchLoading"
        :placeholder="t('inAppCompose.placeholder.selectPosts')"
        :remote-method="loadPostListByKeyword"
        class="w-full"
        clearable
        filterable
        multiple
        remote
      >
        <el-option
          v-for="item in postOptions"
          :key="item.id"
          :label="`${item.postName} · ${item.deptName}`"
          :value="item.id"
        />
      </el-select>
    </el-form-item>

    <template v-if="recipientScopeType === 'DEPT' && showScopeIds">
      <el-form-item :label="t('inAppCompose.selectDepts')" prop="recipientScopeIds">
        <div v-loading="deptTreeLoading" class="w-full">
          <el-cascader
            v-model="recipientScopeIds"
            :options="deptTree"
            :placeholder="t('inAppCompose.placeholder.selectDepts')"
            :props="deptCascaderProps"
            class="w-full"
            clearable
            filterable
            separator="/"
          >
            <template #default="{ data }">
              <span>{{ data.label }}</span>
              <el-text type="info">({{ data.deptCode }})</el-text>
            </template>
          </el-cascader>
        </div>
      </el-form-item>
      <el-form-item :label="t('inAppCompose.includeChildren')">
        <el-switch v-model="includeChildren" />
      </el-form-item>
    </template>

    <el-alert v-if="recipientScopeType === 'ALL'" :closable="false" show-icon type="warning">
      {{ t('inAppCompose.allScopeHint') }}
    </el-alert>
  </div>
</template>
