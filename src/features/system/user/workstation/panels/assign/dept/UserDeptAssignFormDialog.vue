<script lang="ts" setup>
import type { FormDialog } from '@/shared/types/dialog';
import { getDeptList } from '@/features/system/api/dept/dept';
import type { UserDeptAssignForm } from '@/features/system/api/user/user-dept';
import { useOverlayConfirm } from '@/components/ui/Overlay';
import { errorMessage } from '@/services/feedback/message';
import {
  buildDeptSelectTree,
  DeptSelectOptionLabel,
  type DeptSelectTreeNode,
} from '@/components/domain/dept/DeptSelectTree';
import type { CascaderProps, FormInstance, FormRules } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

type UserDeptAssignFormDialogProps = FormDialog<UserDeptAssignForm>;

const props = withDefaults(defineProps<UserDeptAssignFormDialogProps>(), {
  form: () => ({}) as UserDeptAssignForm,
});

const { t } = useI18n();
const confirmOverlay = useOverlayConfirm();
const formRef = ref<FormInstance>();
const form = ref<UserDeptAssignForm>({
  isPrimary: false,
  ...props.form,
});

const deptCascaderProps: CascaderProps = {
  checkStrictly: true,
  emitPath: false,
  value: 'value',
  label: 'label',
  children: 'children',
  disabled: 'disabled',
};

const deptTree = ref<DeptSelectTreeNode[]>([]);

const rules = reactive<FormRules>({
  deptId: [{ required: true, message: t('dept.field.deptName'), trigger: 'change' }],
  isPrimary: [{ required: true, message: t('relation.isPrimary'), trigger: 'change' }],
});

/**
 * 加载部门树（含停用与祖先停用节点；不可选但仍展示）
 */
const loadDeptTree = async () => {
  try {
    const list = await getDeptList();
    deptTree.value = buildDeptSelectTree(list ?? []);
  } catch (error: unknown) {
    errorMessage(error);
    deptTree.value = [];
  }
};

onMounted(() => {
  void loadDeptTree();
});

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" v-enter-submit="() => confirmOverlay?.()" :model="form" :rules="rules" label-width="auto">
    <el-row :gutter="14">
      <el-col :span="24">
        <el-form-item :label="t('dept.field.deptName')" prop="deptId">
          <el-cascader
            v-model="form.deptId"
            :options="deptTree"
            :placeholder="t('dept.placeholder.parentDept')"
            :props="deptCascaderProps"
            class="w-full"
            clearable
            filterable
            separator="/"
          >
            <template #default="{ data }">
              <DeptSelectOptionLabel :data="data" />
            </template>
          </el-cascader>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="t('relation.isPrimary')" prop="isPrimary">
          <el-radio-group v-model="form.isPrimary">
            <el-radio :value="true">{{ t('relation.primary') }}</el-radio>
            <el-radio :value="false">{{ t('relation.secondary') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="t('users.field.remark')" prop="remark">
          <el-input
            v-model="form.remark"
            :placeholder="t('users.field.remark')"
            :rows="3"
            maxlength="255"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
