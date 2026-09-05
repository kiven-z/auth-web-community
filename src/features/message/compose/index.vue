<script lang="ts" setup>
import { type InAppComposeRequest, sendInAppMessage } from '@/features/message/api/in-app-message';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import { useInAppCategoryMajorOptions } from '@/features/message/_shared/hooks/options/use-in-app-category-major-options';
import { useInAppCategorySubOptions } from '@/components/domain/message/in-app-category-sub-options';
import InAppRecipientScopeSelector from '@/features/message/compose/components/InAppRecipientScopeSelector.vue';
import { IN_APP_COMPOSE_PERMS } from '@/features/message/compose/constants/permissions';
import useInAppComposeImport from '@/features/message/compose/hooks/use-in-app-compose-import';
import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import InAppContentEditor from '@/features/message/_shared/components/InAppContentEditor.vue';
import { IN_APP_CONTENT_TYPES } from '@/features/message/api/models/content-type';

defineOptions({
  name: 'MessageCompose',
});

const { t } = useI18n();

const formRef = ref<FormInstance>();
const sending = ref(false);
/** 大类仅用于级联选小类，不提交 */
const majorCategoryId = ref<string>();

const form = reactive<InAppComposeRequest>({
  recipientScopeType: 'USER',
  recipientScopeIds: [],
  includeChildren: true,
  templateCode: undefined,
  title: '',
  body: '',
  contentType: 'TEXT',
  categoryId: undefined,
  linkUrl: undefined,
});

const { majorOptions, loadingMajors, loadMajors } = useInAppCategoryMajorOptions(true);
const { subOptions, loadingSubs, loadSubs } = useInAppCategorySubOptions(true);
const { openTemplateImportDialog, openHistoryImportDialog } = useInAppComposeImport({
  form,
  majorCategoryId,
  subOptions,
  loadSubs,
  loadMajors,
});

const rules = reactive<FormRules>({
  recipientScopeType: [{ required: true, message: t('inAppCompose.recipientScope'), trigger: 'change' }],
  recipientScopeIds: [
    {
      validator: (_rule, _value, callback) => {
        if (form.recipientScopeType === 'ALL' || (form.recipientScopeIds?.length ?? 0) > 0) {
          callback();
          return;
        }
        callback(new Error(t('inAppCompose.rules.recipientScopeIds')));
      },
      trigger: 'change',
    },
  ],
  title: [{ required: true, message: t('inAppCompose.rules.title'), trigger: 'blur' }],
  body: [{ required: true, message: t('inAppCompose.rules.body'), trigger: 'blur' }],
  contentType: [{ required: true, message: t('inAppCompose.rules.contentType'), trigger: 'change' }],
  categoryId: [{ required: true, message: t('inAppCompose.rules.categoryId'), trigger: 'change' }],
});

/**
 * 切换大类：清空小类并拉取对应小类列表
 * @param majorId 大类主键
 */
function handleMajorChange(majorId: string | undefined) {
  form.categoryId = undefined;
  if (!majorId) {
    subOptions.value = [];
    return;
  }
  loadSubs(majorId);
}

/**
 * 重置表单与分类级联态
 */
function resetForm() {
  formRef.value?.resetFields();
  form.templateCode = undefined;
  majorCategoryId.value = undefined;
  subOptions.value = [];
}

/**
 * 提交发送
 */
async function handleSend() {
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid) {
    return;
  }

  const confirmed = await operationConfirm();
  if (!confirmed) {
    return;
  }

  const request: InAppComposeRequest = {
    recipientScopeType: form.recipientScopeType,
    title: form.title,
    body: form.body,
    contentType: form.contentType,
    templateCode: form.templateCode,
    categoryId: form.categoryId!,
    linkUrl: form.linkUrl,
  };

  if (form.recipientScopeType !== 'ALL') {
    request.recipientScopeIds = [...(form.recipientScopeIds ?? [])];
  }

  if (form.recipientScopeType === 'DEPT') {
    request.includeChildren = form.includeChildren;
  }

  try {
    sending.value = true;
    await sendInAppMessage(request);
    message(t('inAppCompose.sendSuccess'), { type: 'success' });
    resetForm();
  } catch (error: unknown) {
    errorMessage(error);
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <div class="message-compose rounded bg-auth-container p-6">
    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-lg font-medium">{{ t('inAppCompose.pageTitle') }}</h1>
      <div>
        <AuthDropdown
          :items="[
            {
              label: t('inAppCompose.importTemplate'),
              permission: IN_APP_COMPOSE_PERMS.SEND,
              onClick: openTemplateImportDialog,
            },
            {
              label: t('inAppCompose.importHistory'),
              permission: [IN_APP_COMPOSE_PERMS.SEND, IN_APP_COMPOSE_PERMS.QUERY],
              onClick: openHistoryImportDialog,
            },
          ]"
        >
          <el-button class="mr-2!" type="success">
            {{ t('inAppCompose.import') }}
          </el-button>
        </AuthDropdown>

        <el-button @click="resetForm">{{ t('buttons.actionReset') }}</el-button>
        <el-button v-auth="IN_APP_COMPOSE_PERMS.SEND" :loading="sending" type="primary" @click="handleSend">
          {{ t('inAppCompose.sendButton') }}
        </el-button>
      </div>
    </div>

    <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
      <InAppRecipientScopeSelector
        v-model:include-children="form.includeChildren"
        v-model:recipient-scope-ids="form.recipientScopeIds"
        v-model:recipient-scope-type="form.recipientScopeType"
      />

      <el-divider />

      <el-form-item v-if="form.templateCode" :label="t('inAppCompose.templateCodeTrace')">
        <el-tag type="info">{{ form.templateCode }}</el-tag>
      </el-form-item>

      <el-form-item :label="t('inAppCompose.title')" prop="title">
        <el-input
          v-model="form.title"
          :placeholder="t('inAppCompose.placeholder.title')"
          clearable
          maxlength="200"
          show-word-limit
        />
      </el-form-item>

      <el-form-item :label="t('inAppCompose.contentType')" prop="contentType">
        <el-segmented v-model="form.contentType" :options="IN_APP_CONTENT_TYPES" class="w-full" />
      </el-form-item>

      <el-form-item :label="t('inAppCompose.majorCategory')" required>
        <el-select
          v-model="majorCategoryId"
          :loading="loadingMajors"
          :placeholder="t('inAppCompose.placeholder.majorCategory')"
          clearable
          filterable
          @change="handleMajorChange"
          @focus="loadMajors"
        >
          <el-option v-for="item in majorOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('inAppCompose.categoryId')" prop="categoryId">
        <el-select
          v-model="form.categoryId"
          :disabled="!majorCategoryId"
          :loading="loadingSubs"
          :placeholder="t('inAppCompose.placeholder.categoryId')"
          clearable
          filterable
        >
          <el-option v-for="item in subOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('inAppCompose.linkUrl')" prop="linkUrl">
        <el-input
          v-model="form.linkUrl"
          :placeholder="t('inAppCompose.placeholder.linkUrl')"
          clearable
          maxlength="500"
        />
      </el-form-item>

      <el-form-item :label="t('inAppCompose.body')" prop="body">
        <InAppContentEditor v-model="form.body" :content-type="form.contentType" />
      </el-form-item>
    </el-form>
  </div>
</template>
