<script lang="ts" setup>
import type { FormDialog } from '@/shared/types/dialog';
import { getDeptList } from '@/features/system/api/dept/dept';
import type { SysPostFormModel } from '@/features/system/api/post/post';
import { useOverlayConfirm } from '@/components/ui/overlay';
import { errorMessage } from '@/services/feedback/message';
import { buildDeptSelectTree, type DeptSelectTreeNode } from '@/components/domain/dept/dept-select-tree';
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
  orderNum: 0,
  ...props.form,
});

const deptCascaderProps: CascaderProps = {
  checkStrictly: true,
  emitPath: false,
  value: 'value',
  label: 'label',
  children: 'children',
};

const deptTree = ref<DeptSelectTreeNode[]>([]);

const rules = reactive<FormRules>({
  deptId: [{ required: true, message: t('post.field.deptName'), trigger: 'change' }],
  postCode: [{ required: true, message: t('post.field.postCode'), trigger: 'blur' }],
  postName: [{ required: true, message: t('post.field.postName'), trigger: 'blur' }],
});

/**
 * 加载部门选择树
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
              <span>{{ data.label }}</span>
              <el-text type="info">({{ data.deptCode }})</el-text>
            </template>
          </el-cascader>
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
