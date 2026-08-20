<script lang="ts" setup>
import type { FormDialog } from '@/shared/types/dialog';
import type { SysRoleCreateForm, SysRoleUpdateForm } from '@/features/system/api/role/role';
import { useOverlayConfirm } from '@/components/ui/Overlay';
import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

type RoleFormDialogProps = FormDialog<SysRoleCreateForm | SysRoleUpdateForm>;

const props = withDefaults(defineProps<RoleFormDialogProps>(), {
  form: () => ({}) as SysRoleCreateForm | SysRoleUpdateForm,
});

const { t } = useI18n();
const confirmOverlay = useOverlayConfirm();
const formRef = ref<FormInstance>();
const form = ref<SysRoleCreateForm | SysRoleUpdateForm>({
  status: true,
  orderNum: 0,
  ...props.form,
});

const rules = reactive<FormRules>({
  roleCode: [
    { required: true, message: t('roles.field.roleCode'), trigger: 'blur' },
    { max: 64, message: t('roles.validation.roleCodeLengthLimit'), trigger: 'blur' },
    { pattern: /^[A-Z][A-Z_]*$/, message: t('roles.validation.roleCodeFormat'), trigger: 'blur' },
  ],
  roleName: [
    { required: true, message: t('roles.field.roleName'), trigger: 'blur' },
    { max: 128, message: t('roles.validation.roleNameLengthLimit'), trigger: 'blur' },
  ],
  status: [{ required: true, message: t('roles.field.status'), trigger: 'change' }],
  remark: [{ max: 500, message: t('roles.validation.remarkLengthLimit'), trigger: 'blur' }],
});

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" v-enter-submit="() => confirmOverlay?.()" :model="form" :rules="rules" label-width="auto">
    <el-row :gutter="14">
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('roles.field.roleCode')" prop="roleCode">
          <el-input v-model="form.roleCode" :placeholder="t('roles.field.roleCode')" />
        </el-form-item>
      </el-col>
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('roles.field.roleName')" prop="roleName">
          <el-input v-model="form.roleName" :placeholder="t('roles.field.roleName')" />
        </el-form-item>
      </el-col>
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('roles.field.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="true">{{ t('buttons.statusActiveText') }}</el-radio>
            <el-radio :value="false">{{ t('buttons.statusInactiveText') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('roles.field.orderNum')" prop="orderNum">
          <el-input-number v-model="form.orderNum" :max="9999" :min="0" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="t('roles.field.remark')" prop="remark">
          <el-input
            v-model="form.remark"
            :placeholder="t('roles.field.remark')"
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
