<script lang="ts" setup>
import type { FormDialog } from '@/shared/types/dialog';
import type { InAppMessageCategoryFormModel } from '@/features/message/api/in-app-category';
import { useOverlayConfirm } from '@/components/ui/Overlay';
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/useCommonBooleanStatusOptions';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { useInAppCategoryMajorOptions } from '@/features/message/_shared/hooks/options/useInAppCategoryMajorOptions';
import type { FormInstance, FormRules } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'InAppCategoryFormDialog',
});

const props = withDefaults(defineProps<FormDialog<InAppMessageCategoryFormModel>>(), {
  form: () => ({}) as InAppMessageCategoryFormModel,
});

const { t } = useI18n();
const confirmOverlay = useOverlayConfirm();
const ph = useFormPlaceholder();
const booleanStatusOptions = useCommonBooleanStatusOptions();
const formRef = ref<FormInstance>();

const form = ref<InAppMessageCategoryFormModel>({
  sortOrder: 0,
  status: true,
  ...props.form,
});

const { majorOptions, loadingMajors, loadMajors } = useInAppCategoryMajorOptions();

/** 编辑时排除自身，避免选自己当父级 */
const selectableMajorOptions = computed(() => majorOptions.value.filter((item) => item.id !== form.value.id));

const rules = reactive<FormRules>({
  code: [
    { required: true, message: ph.input('inAppCategory.field.code'), trigger: 'blur' },
    {
      pattern: /^[A-Z0-9_]+$/,
      message: t('inAppCategory.rules.codePattern'),
      trigger: 'change',
    },
  ],
  name: [{ required: true, message: ph.input('inAppCategory.field.name'), trigger: 'blur' }],
  status: [{ required: true, message: ph.select('inAppCategory.field.status'), trigger: 'change' }],
});

onMounted(() => {
  loadMajors();
});

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" v-enter-submit="() => confirmOverlay?.()" :model="form" :rules="rules" label-width="auto">
    <el-row :gutter="14">
      <!-- 父分类：空=大类；选中大类=小类 -->
      <el-col :span="24">
        <el-form-item :label="t('inAppCategory.field.parentName')" prop="parentId">
          <el-select
            v-model="form.parentId"
            :loading="loadingMajors"
            :placeholder="ph.select('inAppCategory.field.parentName')"
            class="w-full"
            clearable
            filterable
          >
            <el-option
              v-for="item in selectableMajorOptions"
              :key="item.id"
              :label="`${item.name} (${item.code})`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('inAppCategory.field.code')" prop="code">
          <el-input
            v-model="form.code"
            :placeholder="ph.input('inAppCategory.field.code')"
            autocomplete="off"
            clearable
            maxlength="64"
          />
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('inAppCategory.field.name')" prop="name">
          <el-input
            v-model="form.name"
            :placeholder="ph.input('inAppCategory.field.name')"
            autocomplete="off"
            clearable
            maxlength="128"
          />
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('inAppCategory.field.sortOrder')" prop="sortOrder">
          <el-input-number v-model="form.sortOrder" :min="0" class="w-full!" controls-position="right" />
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('inAppCategory.field.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="opt in booleanStatusOptions" :key="String(opt.value)" :value="opt.value">
              {{ opt.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="t('inAppCategory.field.remark')" prop="remark">
          <el-input
            v-model="form.remark"
            :placeholder="ph.input('inAppCategory.field.remark')"
            :rows="3"
            maxlength="500"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
