<script lang="ts" setup>
import { loginByUsernameApi } from '@/api/auth/login';
import { useRenderIcon } from '@/components/ui/icon';
import { LoginFormEmits } from '@/features/home/login/types/login-mode';
import { useUsernamePasswordRules } from '@/features/home/login/rules/username-password.rules';
import type { FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useLoginRemember } from '@/features/home/login/hooks/use-login-remember';
import Motion from './motion';

import { errorMessage } from '@/services/feedback/message';
import Lock from '~icons/ri/lock-fill';
import User from '~icons/ri/user-3-fill';

defineOptions({ name: 'UsernamePasswordForm' });

const emit = defineEmits<LoginFormEmits>();

const { t } = useI18n();
const formRef = ref<FormInstance>();
const loading = ref(false);
const rules = useUsernamePasswordRules();
const { isRemembered, loginAndEstablishSession } = useLoginRemember();

// 登录表单
const formData = reactive({
  username: 'Administrator',
  password: 'Admin@123456',
});

/**
 * 提交登录
 */
const handleSubmit = async () => {
  if (!formRef.value) {
    return;
  }

  const isValid = await formRef.value.validate().catch(() => false);
  if (!isValid) {
    return;
  }

  loading.value = true;
  try {
    await loginAndEstablishSession(() => loginByUsernameApi({ ...formData, rememberMe: isRemembered.value }));
    emit('login-success');
  } catch (error: unknown) {
    errorMessage(error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <el-form ref="formRef" v-enter-submit="handleSubmit" :model="formData" :rules="rules" size="large">
    <Motion :delay="100">
      <el-form-item prop="username">
        <el-input
          v-model="formData.username"
          :placeholder="t('login.authUsername')"
          :prefix-icon="useRenderIcon(User)"
          clearable
        />
      </el-form-item>
    </Motion>

    <Motion :delay="150">
      <el-form-item prop="password">
        <el-input
          v-model="formData.password"
          :placeholder="t('login.authPassword')"
          :prefix-icon="useRenderIcon(Lock)"
          clearable
          show-password
        />
      </el-form-item>
    </Motion>

    <Motion :delay="200">
      <el-checkbox v-model="isRemembered">
        {{ t('login.authRememberMe') }}
      </el-checkbox>
    </Motion>

    <Motion :delay="250">
      <el-button :loading="loading" class="w-full mt-4!" size="default" type="primary" @click="handleSubmit">
        {{ t('login.authLogin') }}
      </el-button>
    </Motion>
  </el-form>
</template>
