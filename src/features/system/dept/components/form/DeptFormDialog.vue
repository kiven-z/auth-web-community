<script lang="ts" setup>
import type { FormDialog } from '@/shared/types/dialog';
import { getDeptList, SysDeptCreateForm, SysDeptUpdateForm } from '@/features/system/api/dept/dept';
import { useOverlayConfirm } from '@/components/ui/overlay';
import { errorMessage } from '@/services/feedback/message';
import {
  buildDeptSelectTree,
  DeptSelectOptionLabel,
  type DeptSelectTreeNode,
} from '@/components/domain/dept/dept-select-tree';
import type { CascaderProps, FormInstance, FormRules } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

type DeptFormModel = SysDeptCreateForm | SysDeptUpdateForm;

type DeptFormDialogProps = FormDialog<DeptFormModel>;

const props = withDefaults(defineProps<DeptFormDialogProps>(), {
  form: () => ({}) as DeptFormModel,
});

const { t } = useI18n();
const confirmOverlay = useOverlayConfirm();
const formRef = ref<FormInstance>();
const form = ref<DeptFormModel>({
  orderNum: 0,
  ...props.form,
});

const parentCascaderProps: CascaderProps = {
  checkStrictly: true,
  emitPath: false,
  value: 'value',
  label: 'label',
  children: 'children',
};

const parentTree = ref<DeptSelectTreeNode[]>([]);

const rules = reactive<FormRules>({
  deptName: [{ required: true, message: t('dept.field.deptName'), trigger: 'blur' }],
  deptCode: [{ required: true, message: t('dept.field.deptCode'), trigger: 'blur' }],
});

/**
 * 加载父部门选择树
 */
const loadParentTree = async () => {
  try {
    const list = await getDeptList();
    parentTree.value = buildDeptSelectTree(list ?? []);
  } catch (e: unknown) {
    errorMessage(e);
    parentTree.value = [];
  }
};

onMounted(() => {
  loadParentTree();
});

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" v-enter-submit="() => confirmOverlay?.()" :model="form" :rules="rules" label-width="auto">
    <el-row :gutter="14">
      <!-- 父部门：空=顶级 -->
      <el-col :span="24">
        <el-form-item :label="t('dept.field.parentDept')" prop="parentId">
          <el-cascader
            v-model="form.parentId"
            :options="parentTree"
            :placeholder="t('dept.placeholder.parentDept')"
            :props="parentCascaderProps"
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

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('dept.field.deptCode')" prop="deptCode">
          <el-input v-model="form.deptCode" :placeholder="t('dept.field.deptCode')" clearable />
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('dept.field.deptName')" prop="deptName">
          <el-input v-model="form.deptName" :placeholder="t('dept.field.deptName')" clearable />
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('dept.field.orderNum')" prop="orderNum">
          <el-input-number v-model="form.orderNum" :max="9999" :min="0" />
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="t('dept.field.remark')" prop="remark">
          <el-input
            v-model="form.remark"
            :placeholder="t('dept.field.remark')"
            :rows="3"
            maxlength="500"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
