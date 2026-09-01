<script lang="ts" setup>
import type { FormDialog } from '@/shared/types/dialog';
import type { SysPermissionCreateForm, SysPermissionUpdateForm } from '@/features/system/api/permission/permission';
import { PERMISSION_CODE_REGEX } from '@/features/system/permission/constants/permission-code-convention';
import { useOverlayConfirm } from '@/components/ui/overlay';
import { useFormPlaceholder } from '@/shared/composables/i18n/use-form-placeholder';
import type { FormInstance, FormRules } from 'element-plus';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

type PermissionFormModel = SysPermissionCreateForm | SysPermissionUpdateForm;

const props = withDefaults(defineProps<FormDialog<PermissionFormModel>>(), {
  form: () => ({}) as PermissionFormModel,
});

const { t } = useI18n();
const confirmOverlay = useOverlayConfirm();
const ph = useFormPlaceholder();
const formRef = ref<FormInstance>();
const form = ref<PermissionFormModel>({
  status: true,
  orderNum: 0,
  ...props.form,
});

const rules = computed<FormRules>(() => ({
  permissionCode: [
    { required: true, message: t('permissions.field.permissionCode'), trigger: 'blur' },
    { max: 128, message: t('permissions.validation.permissionCodeLengthLimit'), trigger: 'blur' },
    { pattern: PERMISSION_CODE_REGEX, message: t('permissions.validation.permissionCodeFormat'), trigger: 'blur' },
  ],
  permissionName: [
    { required: true, message: t('permissions.field.permissionName'), trigger: 'blur' },
    { max: 128, message: t('permissions.validation.permissionNameLengthLimit'), trigger: 'blur' },
  ],
  status: [{ required: true, message: t('permissions.field.status'), trigger: 'change' }],
  remark: [{ max: 500, message: t('permissions.validation.remarkLengthLimit'), trigger: 'blur' }],
}));

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" v-enter-submit="() => confirmOverlay?.()" :model="form" :rules="rules" label-width="auto">
    <el-row :gutter="14">
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('permissions.field.permissionCode')" prop="permissionCode">
          <el-input v-model="form.permissionCode" :placeholder="ph.input('permissions.field.permissionCode')" />
        </el-form-item>
      </el-col>
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('permissions.field.permissionName')" prop="permissionName">
          <el-input v-model="form.permissionName" :placeholder="ph.input('permissions.field.permissionName')" />
        </el-form-item>
      </el-col>
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('permissions.field.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="true">{{ t('permissions.enums.status.active') }}</el-radio>
            <el-radio :value="false">{{ t('permissions.enums.status.inactive') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('permissions.field.orderNum')" prop="orderNum">
          <el-input-number v-model="form.orderNum" :max="9999" :min="0" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="t('permissions.field.remark')" prop="remark">
          <el-input
            v-model="form.remark"
            :placeholder="t('permissions.field.remark')"
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
