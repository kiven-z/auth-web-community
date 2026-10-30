<script lang="ts" setup>
import { buildDeptSelectTree, type DeptSelectTreeNode } from '@/components/domain/dept/dept-select-tree';
import { useOverlayConfirm } from '@/components/ui/overlay';
import DataScopeFormFields from '@/features/system/_shared/components/DataScopeFormFields.vue';
import { getDeptList } from '@/features/system/api/dept/dept';
import { toDataScopeForms, type SysDataScopeForm } from '@/features/system/api/models/data-scope';
import { getRoleScope } from '@/features/system/api/role/role-scope';
import { errorMessage } from '@/services/feedback/message';
import type { FormInstance } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'RoleDataScopeDialog' });

const props = defineProps<{
  /** 角色主键 */
  roleId: string;
}>();

const { t } = useI18n();
const confirmOverlay = useOverlayConfirm();

const formRef = ref<FormInstance>();
const loading = ref(true);
const deptTree = ref<DeptSelectTreeNode[]>([]);
const scopes = ref<SysDataScopeForm[]>([]);

/**
 * 加载部门树与当前角色范围
 */
async function loadDialogData() {
  loading.value = true;
  try {
    const [deptList, rows] = await Promise.all([getDeptList(), getRoleScope(props.roleId)]);
    deptTree.value = buildDeptSelectTree(deptList ?? []);
    scopes.value = toDataScopeForms(rows);
  } catch (error: unknown) {
    errorMessage(error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadDialogData();
});

defineExpose({ formRef, form: scopes });
</script>

<template>
  <div v-loading="loading" class="role-data-scope-dialog">
    <el-alert :closable="false" :title="t('roles.scope.tip')" class="mb-4" show-icon type="info" />
    <el-form ref="formRef" v-enter-submit="() => confirmOverlay?.()" :model="{ scopes }" label-position="top">
      <DataScopeFormFields v-model="scopes" :dept-tree="deptTree" />
    </el-form>
  </div>
</template>
