<script lang="ts" setup>
import type { AdminResetPasswordForm } from './types';
import { usePasswordConfirmRules } from './hooks/usePasswordConfirmRules';
import { useOverlayConfirm } from '@/components/ui/Overlay';
import type { FormInstance } from 'element-plus';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'AdminResetPasswordPanel' });

const { t } = useI18n();
const confirmOverlay = useOverlayConfirm();
const formRef = ref<FormInstance>();
const form = ref<AdminResetPasswordForm>({
  newPassword: '',
  confirmPassword: '',
});

const newPasswordRef = computed(() => form.value.newPassword);

const { rules } = usePasswordConfirmRules(newPasswordRef);

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" v-enter-submit="() => confirmOverlay?.()" :model="form" :rules="rules" label-width="auto">
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
