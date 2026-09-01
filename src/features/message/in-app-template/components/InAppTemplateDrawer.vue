<script lang="ts" setup>
import { useInAppCategorySubOptions } from '@/components/domain/message/in-app-category-sub-options';
import InAppContentEditor from '@/features/message/_shared/components/InAppContentEditor.vue';
import { getInAppMessageCategoryById } from '@/features/message/api/in-app-category';
import type { InAppTemplateFormModel } from '@/features/message/api/in-app-template';
import { useInAppCategoryMajorOptions } from '@/features/message/_shared/hooks/options/use-in-app-category-major-options';
import { IN_APP_CONTENT_TYPES } from '@/features/message/api/models/content-type';
import { errorMessage } from '@/services/feedback/message';
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/use-common-boolean-status-options';
import type { FormDialog } from '@/shared/types/dialog';
import type { FormInstance, FormRules } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'InAppTemplateDrawer',
});

type InAppTemplateDrawerProps = FormDialog<InAppTemplateFormModel>;

const props = withDefaults(defineProps<InAppTemplateDrawerProps>(), {
  form: () => ({}) as InAppTemplateFormModel,
});

const { t } = useI18n();
const booleanStatusOptions = useCommonBooleanStatusOptions();
const formRef = ref<FormInstance>();
/** 大类仅用于级联选小类，不提交 */
const majorCategoryId = ref<string>();

const form = ref<InAppTemplateFormModel>({
  status: true,
  priority: 5,
  contentType: 'MARKDOWN',
  content: '',
  ...props.form,
});

const { majorOptions, loadingMajors, loadMajors } = useInAppCategoryMajorOptions(true);
const { subOptions, loadingSubs, loadSubs } = useInAppCategorySubOptions(true);

const rules = reactive<FormRules>({
  templateCode: [
    { required: true, message: t('inAppTemplate.placeholder.templateCode'), trigger: 'blur' },
    {
      pattern: '^(?=.*[a-zA-Z])[a-zA-Z_-]+$',
      message: t('inAppTemplate.rules.templateCodeReg'),
      trigger: 'change',
    },
  ],
  templateName: [{ required: true, message: t('inAppTemplate.placeholder.templateName'), trigger: 'blur' }],
  subject: [{ required: true, message: t('inAppTemplate.placeholder.subject'), trigger: 'blur' }],
  contentType: [{ required: true, message: t('inAppTemplate.placeholder.contentType'), trigger: 'change' }],
  content: [{ required: true, message: t('inAppTemplate.placeholder.content'), trigger: 'blur' }],
  status: [{ required: true, message: t('inAppTemplate.placeholder.status'), trigger: 'change' }],
  priority: [{ required: true, message: t('inAppTemplate.placeholder.priority'), trigger: 'change' }],
  categoryId: [{ required: true, message: t('inAppTemplate.rules.categoryId'), trigger: 'change' }],
});

/**
 * 切换大类：清空小类并拉取对应小类列表
 * @param majorId 大类主键
 */
function handleMajorChange(majorId: string | undefined) {
  form.value.categoryId = undefined;
  if (!majorId) {
    subOptions.value = [];
    return;
  }
  loadSubs(majorId);
}

onMounted(async () => {
  const categoryId = form.value.categoryId;
  if (!categoryId) {
    return;
  }
  try {
    const minor = await getInAppMessageCategoryById(categoryId);
    const parentId = minor.parentId;
    if (parentId && parentId !== '0') {
      await loadMajors();
      majorCategoryId.value = parentId;
      await loadSubs(parentId);
    }
  } catch (error: unknown) {
    errorMessage(error);
    form.value.categoryId = undefined;
  }
});

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <el-row :gutter="14">
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('inAppTemplate.templateCode')" prop="templateCode">
          <el-input
            v-model="form.templateCode"
            :placeholder="t('inAppTemplate.placeholder.templateCode')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('inAppTemplate.templateName')" prop="templateName">
          <el-input
            v-model="form.templateName"
            :placeholder="t('inAppTemplate.placeholder.templateName')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="t('inAppTemplate.subject')" prop="subject">
          <el-input
            v-model="form.subject"
            :placeholder="t('inAppTemplate.placeholder.subject')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('inAppTemplate.contentType')" prop="contentType">
          <el-radio-group v-model="form.contentType">
            <el-radio-button v-for="type in IN_APP_CONTENT_TYPES" :key="type" :value="type">
              {{ type }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('inAppTemplate.priority')" prop="priority">
          <el-input-number v-model="form.priority" :max="10" :min="1" class="w-full" controls-position="right" />
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('inAppTemplate.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="opt in booleanStatusOptions" :key="String(opt.value)" :value="opt.value">
              {{ opt.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('inAppTemplate.majorCategory')" required>
          <el-select
            v-model="majorCategoryId"
            :loading="loadingMajors"
            :placeholder="t('inAppTemplate.placeholder.majorCategory')"
            clearable
            filterable
            @change="handleMajorChange"
            @focus="loadMajors"
          >
            <el-option v-for="item in majorOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('inAppTemplate.categoryId')" prop="categoryId">
          <el-select
            v-model="form.categoryId"
            :disabled="!majorCategoryId"
            :loading="loadingSubs"
            :placeholder="t('inAppTemplate.placeholder.categoryId')"
            clearable
            filterable
          >
            <el-option v-for="item in subOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="t('inAppTemplate.linkUrl')" prop="linkUrl">
          <el-input
            v-model="form.linkUrl"
            :placeholder="t('inAppTemplate.placeholder.linkUrl')"
            autocomplete="off"
            clearable
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="t('inAppTemplate.description')" prop="description">
          <el-input
            v-model="form.description"
            :placeholder="t('inAppTemplate.placeholder.description')"
            autocomplete="off"
            maxlength="500"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="t('inAppTemplate.content')" prop="content">
          <InAppContentEditor v-model="form.content" :content-type="form.contentType" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
