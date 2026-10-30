<script lang="ts" setup>
import { getDeptList } from '@/features/system/api/dept/dept';
import { createDeptScopeForm, findDeptScope, scopeTypeRequiresIds } from '@/features/system/api/models/data-scope';
import { getRoleScope, type SysDataScopeForm } from '@/features/system/api/role/role-scope';
import { useOverlayConfirm } from '@/components/ui/overlay';
import { errorMessage } from '@/services/feedback/message';
import DataScopeFormFields from '@/features/system/_shared/components/DataScopeFormFields.vue';
import { buildDeptSelectTree, type DeptSelectTreeNode } from '@/components/domain/dept/dept-select-tree';
import type { FormInstance, FormRules } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
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

const form = ref<SysDataScopeForm>(createDeptScopeForm());

const rules = reactive<FormRules>({
  scopeType: [{ required: true, message: t('dataScope.field.type'), trigger: 'change' }],
  scopeIds: [
    {
      required: true,
      validator: (_rule, value: string[], callback) => {
        if (!scopeTypeRequiresIds(form.value.scopeType)) {
          callback();
          return;
        }
        if (!value?.length) {
          callback(new Error(t('dataScope.validation.scopeIdsRequired')));
          return;
        }
        callback();
      },
      trigger: 'change',
    },
  ],
  remark: [{ max: 500, message: t('dataScope.validation.remarkMaxLength'), trigger: 'blur' }],
});

/**
 * 加载部门树与当前角色范围
 */
async function loadDialogData() {
  loading.value = true;
  try {
    const [deptList, scopes] = await Promise.all([getDeptList(), getRoleScope(props.roleId)]);
    deptTree.value = buildDeptSelectTree(deptList ?? []);
    const scope = findDeptScope(scopes);
    if (!scope) {
      return;
    }
    form.value = createDeptScopeForm(scope);
  } catch (error: unknown) {
    errorMessage(error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadDialogData();
});

defineExpose({ formRef, form });
</script>

<template>
  <div v-loading="loading" class="role-data-scope-dialog">
    <el-alert :closable="false" :title="t('roles.scope.tip')" class="mb-4" show-icon type="info" />
    <el-form ref="formRef" v-enter-submit="() => confirmOverlay?.()" :model="form" :rules="rules" label-position="top">
      <DataScopeFormFields v-model="form" :dept-tree="deptTree" />
    </el-form>
  </div>
</template>
