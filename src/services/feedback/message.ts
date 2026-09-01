import { transformI18n } from '@/app/plugins/i18n';
import { shouldSkipErrorFeedback } from '@/core/http/api-error';
import { ElMessage, type MessageHandler } from 'element-plus';
import isFunction from 'lodash/isFunction';
import type { VNode } from 'vue';

type messageStyle = 'el' | 'antd';
type messageTypes = 'info' | 'success' | 'warning' | 'error';

// 无显式文案且无法从异常解析时的默认 i18n 键（见 locales tips.requestFailed
const DEFAULT_ERROR_FALLBACK_I18N_KEY = 'tips.requestFailed';

/** {@link message} 配置 */
interface MessageParams {
  /** 消息类型，默认 info */
  type?: messageTypes;
  /** 是否纯色，默认 false */
  plain?: boolean;
  /** 自定义图标，会覆盖 type 的默认图标 */
  icon?: any;
  /** 是否将 message 作为 HTML 片段处理，默认 false */
  dangerouslyUseHTMLString?: boolean;
  /** 消息风格，默认 antd */
  customClass?: messageStyle;
  /** 显示时长（毫秒），0 表示不自动关闭，默认 2000 */
  duration?: number;
  /** 是否显示关闭按钮，默认 false */
  showClose?: boolean;
  /** 距离窗口顶部的偏移量，默认 16 */
  offset?: number;
  /** 挂载根元素，默认 document.body */
  appendTo?: string | HTMLElement;
  /** 是否合并内容相同的消息，默认 false */
  grouping?: boolean;
  /** 重复次数，与 grouping 联用时作为初始数量，默认 1 */
  repeatNum?: number;
  /** 关闭时的回调 */
  onClose?: Function | null;
}

/**
 * {@link errorMessage} 专用：可传显式文案与兜底 i18n 键，其余字段透传 {@link MessageParams}
 * @param message 消息
 * @param defaultI18nKey 默认 i18n 键
 */
type ErrorMessageParams = Omit<MessageParams, 'type'> & {
  /** 有非空值时优先展示，不再使用 error 与兜底文案 */
  message?: string;
  /** 无显式文案且无法从 error 解析时的 i18n 键，默认 tips.requestFailed */
  defaultI18nKey?: string;
};

/**
 * 解析 catch 中应展示给用户的错误文案：显式 message → Error.message → 兜底 i18n。
 * @param error 错误
 * @param options 选项
 * @returns 错误文案
 */
function resolveCaughtErrorText(
  error: unknown,
  options?: Pick<ErrorMessageParams, 'message' | 'defaultI18nKey'>
): string {
  const explicit = options?.message;
  if (explicit) {
    return explicit;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  const i18nKey = options?.defaultI18nKey ?? DEFAULT_ERROR_FALLBACK_I18N_KEY;
  return transformI18n(i18nKey);
}

/**
 * Message 消息提示函数
 * @param message 消息
 * @param params 参数
 * @returns 消息提示函数
 */
const message = (message: string | VNode | (() => VNode), params?: MessageParams): MessageHandler => {
  if (params) {
    const {
      icon,
      type = 'info',
      plain = false,
      dangerouslyUseHTMLString = false,
      customClass = 'antd',
      duration = 2000,
      showClose = false,
      offset = 16,
      appendTo = document.body,
      grouping = false,
      repeatNum = 1,
      onClose,
    } = params;

    return ElMessage({
      message,
      icon,
      type,
      plain,
      dangerouslyUseHTMLString,
      duration,
      showClose,
      offset,
      appendTo,
      grouping,
      repeatNum,
      // 全局搜 auth-message 即可知道该类的样式位置
      customClass: customClass === 'antd' ? 'auth-message' : '',
      onClose: () => (isFunction(onClose) ? onClose() : null),
    });
  }

  return ElMessage({
    message,
    customClass: 'auth-message',
  });
};

/**
 * 以 error 类型展示消息：逻辑同 {@link resolveCaughtErrorText}；
 * 会话结束 / 取消请求且无显式文案时跳过。
 * @param error 捕获的异常
 * @param params 消息配置
 * @returns Message 实例；跳过反馈时为 undefined
 */
const errorMessage = (error: unknown, params?: ErrorMessageParams): MessageHandler | undefined => {
  const { message: explicitMessage, defaultI18nKey, ...rest } = params ?? {};
  if (!explicitMessage && shouldSkipErrorFeedback(error)) {
    return undefined;
  }
  const text = resolveCaughtErrorText(error, { message: explicitMessage, defaultI18nKey });
  return message(text, { type: 'error', ...rest, grouping: true });
};

export { errorMessage, message };
