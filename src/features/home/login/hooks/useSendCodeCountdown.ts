import { useCountdown } from '@vueuse/core';
import { computed } from 'vue';

/** 验证码发送按钮默认倒计时时长（秒） */
const DEFAULT_SEND_CODE_COUNTDOWN_SECONDS = 60;

/**
 * 验证码发送倒计时：remaining 为 0 时可再次发送。
 * 组件卸载时由 VueUse（useIntervalFn）自动清理定时器。
 * @param seconds 倒计时时长（秒）
 * @returns 剩余秒数与开始倒计时方法
 */
export function useSendCodeCountdown(seconds = DEFAULT_SEND_CODE_COUNTDOWN_SECONDS) {
  const { remaining, start } = useCountdown(0);
  const isCounting = computed(() => remaining.value > 0);

  const startCountdown = () => start(seconds);

  return {
    countdown: remaining,
    isCounting,
    startCountdown,
  };
}
