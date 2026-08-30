import { ApiBusinessError, ApiConflictError } from '@/core/http/apiError';
import { getTopMenu } from '@/router/utils/misc';
import { initRouter } from '@/router/utils/route-registry';
import { message } from '@/services/feedback/message';
import { defaultLoginMode } from '@/features/home/login/constants/login-registry';
import type { LoginMode } from '@/features/home/login/types/login-mode';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

/**
 * 登录页状态与导航
 * @returns 登录模式切换与成功跳转方法
 */
function useLogin() {
  const router = useRouter();
  const { t } = useI18n();

  const currentMode = ref<LoginMode>(defaultLoginMode);

  // 用于切换动画时触发 key 变化，让组件重新挂载获得入场动画
  const formKey = ref(0);

  /**
   * 切换登录模式
   * @param mode 登录模式
   */
  const switchMode = (mode: LoginMode) => {
    if (mode === currentMode.value) return;
    currentMode.value = mode;
    formKey.value++;
  };

  /**
   * 表单组件内部登录成功后调用的回调。
   * 统一处理：加载路由、跳转首页。
   */
  const onLoginSuccess = async () => {
    try {
      await initRouter();
      await router.push(getTopMenu(true)?.path ?? '/');
      message(t('login.authLoginSuccess'), { type: 'success' });
    } catch (err: unknown) {
      if (err instanceof ApiConflictError) {
        return;
      }
      const text = err instanceof ApiBusinessError ? err.message : t('login.authLoginFail');
      message(text, { type: 'error' });
    }
  };

  return {
    currentMode,
    formKey,
    switchMode,
    onLoginSuccess,
  };
}

export default useLogin;
