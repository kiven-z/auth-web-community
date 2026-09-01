<script lang="ts" setup>
import type { FormDialog } from '@/shared/types/dialog';
import { getDeptList } from '@/features/system/api/dept/dept';
import type { SysPostFormModel } from '@/features/system/api/post/post';
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

type PostFormDialogProps = FormDialog<SysPostFormModel>;

const props = withDefaults(defineProps<PostFormDialogProps>(), {
  form: () => ({}) as SysPostFormModel,
});

const { t } = useI18n();
const confirmOverlay = useOverlayConfirm();
const formRef = ref<FormInstance>();
const form = ref<SysPostFormModel>({
  status: true,
  orderNum: 0,
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
  deptId: [{ required: true, message: t('post.field.deptName'), trigger: 'change' }],
  postCode: [{ required: true, message: t('post.field.postCode'), trigger: 'blur' }],
  postName: [{ required: true, message: t('post.field.postName'), trigger: 'blur' }],
  status: [{ required: true, message: t('post.field.status'), trigger: 'change' }],
});

/**
 * 加载部门树（含停用与祖先停用节点；不可选但仍展示）
 */
const loadDeptTree = async () => {
  try {
    const list = await getDeptList();
    deptTree.value = buildDeptSelectTree(list ?? []);
  } catch (e: unknown) {
    errorMessage(e);
    deptTree.value = [];
  }
};

onMounted(() => {
  loadDeptTree();
});

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" v-enter-submit="() => confirmOverlay?.()" :model="form" :rules="rules" label-width="auto">
    <el-row :gutter="14">
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('post.field.postCode')" prop="postCode">
          <el-input v-model="form.postCode" :placeholder="t('post.field.postCode')" clearable />
        </el-form-item>
      </el-col>
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('post.field.postName')" prop="postName">
          <el-input v-model="form.postName" :placeholder="t('post.field.postName')" clearable />
        </el-form-item>
      </el-col>
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('post.field.deptName')" prop="deptId">
          <el-cascader
            v-model="form.deptId"
            :options="deptTree"
            :placeholder="t('post.placeholder.dept')"
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
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('post.field.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="true">{{ t('buttons.statusActiveText') }}</el-radio>
            <el-radio :value="false">{{ t('buttons.statusInactiveText') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('post.field.orderNum')" prop="orderNum">
          <el-input-number v-model="form.orderNum" :max="9999" :min="0" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="t('post.field.remark')" prop="remark">
          <el-input
            v-model="form.remark"
            :placeholder="t('post.field.remark')"
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
