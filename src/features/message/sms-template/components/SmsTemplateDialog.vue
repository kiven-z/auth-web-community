<script lang="ts" setup>
import type { FormDialog } from '@/shared/types/dialog';
import type { SmsTemplateFormModel } from '@/features/message/api/smsTemplate';
import { useOverlayConfirm } from '@/components/ui/Overlay';
import type { FormInstance, FormRules } from 'element-plus';
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/useCommonBooleanStatusOptions';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'SmsTemplateDialog',
});

type SmsTemplateDialogProps = FormDialog<SmsTemplateFormModel>;

const props = withDefaults(defineProps<SmsTemplateDialogProps>(), {
  form: () => ({}) as SmsTemplateFormModel,
});

const { t } = useI18n();
const confirmOverlay = useOverlayConfirm();
const booleanStatusOptions = useCommonBooleanStatusOptions();
const formRef = ref<FormInstance>();

const form = ref<SmsTemplateFormModel>({
  status: true,
  priority: 1,
  content: '',
  ...props.form,
});

const rules = reactive<FormRules>({
  // 场景编码
  templateCode: [
    { required: true, message: t('smsTemplate.placeholder.templateCode'), trigger: 'blur' },
    {
      pattern: '^(?=.*[a-zA-Z])[a-zA-Z_-]+$',
      message: t('smsTemplate.rules.templateCodeReg'),
      trigger: 'change',
    },
  ],
  // 模板名称
  templateName: [{ required: true, message: t('smsTemplate.placeholder.templateName'), trigger: 'blur' }],
  // 厂商模板编码
  providerTemplateCode: [
    { required: true, message: t('smsTemplate.placeholder.providerTemplateCode'), trigger: 'blur' },
  ],
  // 状态
  status: [{ required: true, message: t('smsTemplate.placeholder.status'), trigger: 'change' }],
  // 优先级
  priority: [{ required: true, message: t('smsTemplate.placeholder.priority'), trigger: 'change' }],
});

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" v-enter-submit="() => confirmOverlay?.()" :model="form" :rules="rules" label-width="auto">
    <el-row :gutter="14">
      <!-- 场景编码（scene_code） -->
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('smsTemplate.templateCode')" prop="templateCode">
          <el-input
            v-model="form.templateCode"
            :placeholder="t('smsTemplate.placeholder.templateCode')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('smsTemplate.templateName')" prop="templateName">
          <el-input
            v-model="form.templateName"
            :placeholder="t('smsTemplate.placeholder.templateName')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="t('smsTemplate.providerTemplateCode')" prop="providerTemplateCode">
          <el-input
            v-model="form.providerTemplateCode"
            :placeholder="t('smsTemplate.placeholder.providerTemplateCode')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('smsTemplate.priority')" prop="priority">
          <el-input-number v-model="form.priority" :max="10" :min="1" class="w-full" controls-position="right" />
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('smsTemplate.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="opt in booleanStatusOptions" :key="String(opt.value)" :value="opt.value">
              {{ opt.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="t('smsTemplate.description')" prop="description">
          <el-input
            v-model="form.description"
            :placeholder="t('smsTemplate.placeholder.description')"
            autocomplete="off"
            maxlength="500"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <!-- 模板正文备注（发送以厂商模板为准） -->
        <el-form-item :label="t('smsTemplate.content')" prop="content">
          <el-input
            v-model="form.content"
            :placeholder="t('smsTemplate.placeholder.content')"
            :rows="6"
            autocomplete="off"
            type="textarea"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
