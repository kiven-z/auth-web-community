<script lang="ts" setup>
import type { SelfChangePasswordForm } from './types';
import { usePasswordConfirmRules } from './hooks/use-password-confirm-rules';
import { useOverlayConfirm } from '@/components/ui/overlay';
import type { FormInstance, FormRules } from 'element-plus';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'SelfChangePasswordPanel' });

const { t } = useI18n();
const confirmOverlay = useOverlayConfirm();
const formRef = ref<FormInstance>();
const form = ref<SelfChangePasswordForm>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const newPasswordRef = computed(() => form.value.newPassword);

const { rules: passwordConfirmRules } = usePasswordConfirmRules(newPasswordRef);

const rules = computed<FormRules>(() => ({
  oldPassword: [{ required: true, message: t('users.password.old'), trigger: 'blur' }],
  ...passwordConfirmRules.value,
}));

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" v-enter-submit="() => confirmOverlay?.()" :model="form" :rules="rules" label-width="auto">
    <el-form-item :label="t('users.password.old')" prop="oldPassword">
      <el-input
        v-model="form.oldPassword"
        :placeholder="t('users.password.old')"
        autocomplete="current-password"
        show-password
        type="password"
      />
    </el-form-item>
    <el-form-item :label="t('users.password.new')" prop="newPassword">
      <el-input
        v-model="form.newPassword"
        :placeholder="t('users.password.new')"
        autocomplete="new-password"
        show-password
        type="password"
      />
    </el-form-item>
    <el-form-item :label="t('users.password.confirm')" prop="confirmPassword">
      <el-input
        v-model="form.confirmPassword"
        :placeholder="t('users.password.confirm')"
        autocomplete="new-password"
        show-password
        type="password"
      />
    </el-form-item>
  </el-form>
</template>
