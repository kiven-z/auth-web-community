<script lang="ts" setup>
import type { FormDialog } from '@/shared/types/dialog';
import type { EmailTemplateMonacoFormModel } from '@/features/message/api/email-template';
import EmailTemplateContentEditor from '@/features/message/email-template/components/EmailTemplateContentEditor.vue';
import EmailTemplateLivePreview from '@/features/message/email-template/components/EmailTemplateLivePreview.vue';
import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'EmailTemplateMonacoOnlyDrawer',
});

const props = withDefaults(defineProps<FormDialog<EmailTemplateMonacoFormModel>>(), {
  form: () => ({}) as EmailTemplateMonacoFormModel,
});

const { t } = useI18n();

const formRef = ref<FormInstance>();

const form = ref<EmailTemplateMonacoFormModel>({
  status: true,
  priority: 5,
  content: '',
  requireFields: [],
  ...props.form,
});

watch(
  () => props.form,
  (formPayload) => {
    form.value = {
      status: true,
      priority: 5,
      requireFields: [],
      ...formPayload,
    };
  },
  { deep: true }
);

const rules = reactive<FormRules>({
  // 内容
  content: [{ required: true, message: t('emailTemplate.placeholder.content'), trigger: 'blur' }],
});

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules">
    <el-row :gutter="16">
      <el-col :lg="14" :md="14" :sm="24" :xs="24">
        <div class="mb-2">{{ t('emailTemplate.content') }}</div>
        <el-form-item prop="content">
          <EmailTemplateContentEditor v-model:value="form.content" :require-fields="form.requireFields ?? []" />
        </el-form-item>
      </el-col>

      <el-col :lg="10" :md="10" :sm="24" :xs="24">
        <div class="font-medium mb-2">{{ t('emailTemplate.liveRenderPreview') }}</div>
        <EmailTemplateLivePreview :content="form.content ?? ''" :require-fields="form.requireFields ?? []" />
      </el-col>
    </el-row>
  </el-form>
</template>
