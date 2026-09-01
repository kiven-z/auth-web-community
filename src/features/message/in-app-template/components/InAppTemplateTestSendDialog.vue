<script lang="ts" setup>
import type { FormDialog } from '@/shared/types/dialog';
import useRemoteUserSearch from '@/components/domain/user/remote-user-search';
import { useOverlayConfirm } from '@/components/ui/overlay';
import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'InAppTemplateTestSendDialog',
});

/**
 * 站内信模板测试发送表单（target 为用户 ID）
 */
interface InAppTemplateTestSendForm {
  id: string;
  target: string;
}

/** 站内信模板测试发送弹窗 props */
interface InAppTemplateTestSendDialogProps extends FormDialog<InAppTemplateTestSendForm> {
  /** 接收用户字段 label i18n key */
  targetLabelI18nKey?: string;
  /** 接收用户 placeholder i18n key */
  targetPlaceholderI18nKey?: string;
}

const props = withDefaults(defineProps<InAppTemplateTestSendDialogProps>(), {
  form: () => ({ id: '', target: '' }),
  targetLabelI18nKey: 'inAppTemplate.testSendUser',
  targetPlaceholderI18nKey: 'inAppTemplate.testSendUserPlaceholder',
});

const { t } = useI18n();
const confirmOverlay = useOverlayConfirm();
const formRef = ref<FormInstance>();
const form = ref<InAppTemplateTestSendForm>(props.form);

const { userOptions, userSearchLoading, loadUserListByKeyword } = useRemoteUserSearch({
  limit: 50,
});

const rules = reactive<FormRules>({
  target: [{ required: true, message: t(props.targetPlaceholderI18nKey), trigger: 'change' }],
});

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" v-enter-submit="() => confirmOverlay?.()" :model="form" :rules="rules" label-width="auto">
    <el-form-item :label="t(targetLabelI18nKey)" prop="target">
      <el-select
        v-model="form.target"
        :loading="userSearchLoading"
        :placeholder="t(targetPlaceholderI18nKey)"
        :remote-method="loadUserListByKeyword"
        class="w-full"
        clearable
        filterable
        remote
        reserve-keyword
      >
        <el-option
          v-for="item in userOptions"
          :key="item.id"
          :label="item.nickname ? `${item.username}(${item.nickname})` : item.username"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>
