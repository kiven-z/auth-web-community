<script lang="ts" setup>
import { loginBySmsApi, sendSmsCodeApi } from '@/api/auth/login';
import { useRenderIcon } from '@/components/ui/icon';
import { errorMessage, message } from '@/services/feedback/message';
import { LoginFormEmits } from '@/features/home/login/types/login-mode';
import { useLoginRemember } from '@/features/home/login/hooks/use-login-remember';
import { useSendCodeCountdown } from '@/features/home/login/hooks/use-send-code-countdown';
import { useSmsLoginRules } from '@/features/home/login/rules/sms.rules';
import type { FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Motion from './motion';

import CodeIcon from '~icons/ri/message-3-fill';
import PhoneIcon from '~icons/ri/phone-fill';

defineOptions({ name: 'SmsLoginForm' });

const emit = defineEmits<LoginFormEmits>();

const { t } = useI18n();
const formRef = ref<FormInstance>();
const loading = ref(false);
const rules = useSmsLoginRules();
const { isRemembered, loginAndEstablishSession } = useLoginRemember();

// 登录表单
const formData = reactive({
  phone: '',
  code: '',
});

const { countdown, isCounting, startCountdown } = useSendCodeCountdown();

/**
 * 发送验证码
 */
const handleSendCode = async () => {
  // 倒计时未结束或手机号未输入
  if (isCounting.value || !formData.phone) return;

  try {
    // 发送验证码
    await sendSmsCodeApi({ phone: formData.phone });
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

  const isValid = await formRef.value.validate().catch(() => false);
  if (!isValid) {
    return;
  }

  loading.value = true;
  try {
    await loginAndEstablishSession(() => loginBySmsApi({ ...formData, rememberMe: isRemembered.value }));
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
      <el-form-item prop="phone">
        <el-input
          v-model="formData.phone"
          :placeholder="t('login.authPhone')"
          :prefix-icon="useRenderIcon(PhoneIcon)"
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
            <el-button :disabled="isCounting || !formData.phone" class="w-[120px]" @click="handleSendCode">
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
      <el-button :loading="loading" class="mt-4! w-full" size="default" type="primary" @click="handleSubmit">
        {{ t('login.authLogin') }}
      </el-button>
    </Motion>
  </el-form>
</template>
