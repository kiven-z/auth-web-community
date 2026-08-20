<script lang="ts" setup>
import type { FormDialog } from '@/shared/types/dialog';
import { useOverlayConfirm } from '@/components/ui/Overlay';
import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'MessageTemplateTestSendDialog',
});

/**
 * 测试发送表单（target 语义由渠道解释）
 */
interface MessageTemplateTestSendForm {
  id: string;
  target: string;
}

/** 消息模板测试发送弹窗 props */
interface MessageTemplateTestSendDialogProps extends FormDialog<MessageTemplateTestSendForm> {
  /** 接收目标字段 label i18n key */
  targetLabelI18nKey?: string;
  /** 接收目标 placeholder i18n key */
  targetPlaceholderI18nKey?: string;
}

const props = withDefaults(defineProps<MessageTemplateTestSendDialogProps>(), {
  form: () => ({ id: '', target: '' }),
  targetLabelI18nKey: 'messageTemplate.testSendTarget',
  targetPlaceholderI18nKey: 'messageTemplate.placeholder.testSendTarget',
});

const { t } = useI18n();
const confirmOverlay = useOverlayConfirm();
const formRef = ref<FormInstance>();
const form = ref<MessageTemplateTestSendForm>(props.form);

const rules = reactive<FormRules>({
  target: [{ required: true, message: t(props.targetPlaceholderI18nKey), trigger: 'blur' }],
});

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" v-enter-submit="() => confirmOverlay?.()" :model="form" :rules="rules" label-width="auto">
    <!-- 接收目标：邮箱 / 手机号 / 用户 ID 等，由渠道解释；不做格式校验 -->
    <el-form-item :label="t(targetLabelI18nKey)" prop="target">
      <el-input v-model="form.target" :placeholder="t(targetPlaceholderI18nKey)" clearable />
    </el-form-item>
  </el-form>
</template>
