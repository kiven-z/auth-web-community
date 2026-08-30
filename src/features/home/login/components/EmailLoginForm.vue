<script lang="ts" setup>
import { loginByEmailApi, sendEmailCodeApi } from '@/api/auth/login';
import { useRenderIcon } from '@/components/ui/Icon';
import { errorMessage, message } from '@/services/feedback/message';
import { LoginFormEmits } from '@/features/home/login/types/loginMode';
import { useLoginRemember } from '@/features/home/login/hooks/useLoginRemember';
import { useSendCodeCountdown } from '@/features/home/login/hooks/useSendCodeCountdown';
import { useEmailLoginRules } from '@/features/home/login/rules/email.rules';
import type { FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Motion from './Motion';

import EmailIcon from '~icons/ri/mail-fill';
import CodeIcon from '~icons/ri/message-3-fill';

defineOptions({ name: 'EmailLoginForm' });

const emit = defineEmits<LoginFormEmits>();

const { t } = useI18n();
const formRef = ref<FormInstance>();
const loading = ref(false);
const rules = useEmailLoginRules();
const { isRemembered, loginAndEstablishSession } = useLoginRemember();

// 登录表单
const formData = reactive({
  email: '',
  code: '',
});

const { countdown, isCounting, startCountdown } = useSendCodeCountdown();

/**
 * 发送验证码
 */
const handleSendCode = async () => {
  // 倒计时未结束或邮箱未输入
  if (isCounting.value || !formData.email) return;

  try {
    // 发送验证码
    await sendEmailCodeApi({ email: formData.email });
    message(t('login.authSendCodeSuccess'), { type: 'success' });

    // 开始倒计时
    startCountdown();
  } catch (error: unknown) {
    errorMessage(error);
  }
};

/**
 * 提交登录
 */
const handleSubmit = async () => {
  if (!formRef.value) {
    return;
  }

  // 验证表单
  const isValid = await formRef.value.validate().catch(() => false);
  if (!isValid) {
    return;
  }

  loading.value = true;
  try {
    await loginAndEstablishSession(() => loginByEmailApi({ ...formData, rememberMe: isRemembered.value }));
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
      <el-form-item prop="email">
        <el-input
          v-model="formData.email"
          :placeholder="t('login.authEmail')"
          :prefix-icon="useRenderIcon(EmailIcon)"
          clearable
        />
      </el-form-item>
    </Motion>

    <Motion :delay="150">
      <el-form-item prop="code">
        <el-input
          v-model="formData.code"
          :placeholder="t('login.authCode')"
          :prefix-icon="useRenderIcon(CodeIcon)"
          clearable
        >
          <template #append>
            <el-button :disabled="isCounting || !formData.email" class="w-[120px]" @click="handleSendCode">
              {{ isCounting ? `${countdown}s` : t('login.authSendCode') }}
            </el-button>
          </template>
        </el-input>
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
