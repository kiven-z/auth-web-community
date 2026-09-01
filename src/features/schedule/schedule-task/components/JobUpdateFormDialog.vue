<script lang="ts" setup>
import type { SysJobDetailRow, SysJobUpdateForm } from '@/features/schedule/api/job';
import { useFormPlaceholder } from '@/shared/composables/i18n/use-form-placeholder';
import JobFormScheduleExtrasFields from '@/features/schedule/schedule-task/components/JobFormScheduleExtrasFields.vue';
import useJobCatalog from '@/features/schedule/schedule-task/hooks/use-job-catalog';
import useJobFormOptions from '@/features/schedule/schedule-task/hooks/options/use-job-form-options';
import type { FormInstance, FormRules } from 'element-plus';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'JobUpdateFormDialog',
});

interface JobUpdateFormDialogProps {
  detail: SysJobDetailRow;
}

const props = defineProps<JobUpdateFormDialogProps>();

const { t } = useI18n();
const ph = useFormPlaceholder();
const { taskTypeOptions } = useJobFormOptions();
const formRef = ref<FormInstance>();

const form = ref(props.detail as SysJobUpdateForm);

const { findJobParamsExample, loadCatalogClasses } = useJobCatalog();

const taskTypeLabel = computed(() => {
  const option = taskTypeOptions.value.find((item) => item.value === props.detail.taskType);
  return option?.label ?? props.detail.taskType ?? '—';
});

const isBeanInvoke = computed(() => form.value.taskType === 'BEAN_INVOKE');
const isCustomClass = computed(() => form.value.taskType === 'CUSTOM_CLASS');

const jobParamsExample = computed(() => {
  if (!isCustomClass.value || !props.detail.jobClass) {
    return undefined;
  }
  return findJobParamsExample(props.detail.jobClass);
});

const rules = computed<FormRules>(() => ({
  cronExpression: [
    { required: true, message: ph.select('scheduleTask.fields.cronExpression'), trigger: 'change' },
    { max: 255, message: t('scheduleTask.validation.cronExpressionLengthLimit'), trigger: 'change' },
  ],
  timeZone: [{ required: true, message: ph.select('scheduleTask.fields.timeZone'), trigger: 'change' }],
  misfirePolicy: [{ required: true, message: ph.select('scheduleTask.fields.misfirePolicy'), trigger: 'change' }],
  concurrent: [{ required: true, message: ph.select('scheduleTask.fields.concurrent'), trigger: 'change' }],
  status: [{ required: true, message: ph.select('scheduleTask.fields.status'), trigger: 'change' }],

  ...(isBeanInvoke.value
    ? { invokeTarget: [{ required: true, message: ph.input('scheduleTask.fields.invokeTarget'), trigger: 'blur' }] }
    : {}),
}));

onMounted(() => {
  void loadCatalogClasses();
});

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <el-row :gutter="14">
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="t('scheduleTask.fields.jobName')">
          <el-input :model-value="detail.jobName" disabled />
        </el-form-item>
      </el-col>
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="t('scheduleTask.fields.jobGroup')">
          <el-input :model-value="detail.jobGroup" disabled />
        </el-form-item>
      </el-col>
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="t('scheduleTask.fields.taskType')">
          <el-input :model-value="taskTypeLabel" disabled />
        </el-form-item>
      </el-col>
      <el-col v-if="detail.jobClass" :span="24">
        <el-form-item :label="t('scheduleTask.fields.jobClass')">
          <el-input :model-value="detail.jobClass" disabled />
        </el-form-item>
      </el-col>

      <el-col v-if="isBeanInvoke" :span="24">
        <el-form-item :label="t('scheduleTask.fields.invokeTarget')" prop="invokeTarget">
          <el-input
            v-model="form.invokeTarget"
            :placeholder="ph.input('scheduleTask.fields.invokeTarget')"
            :rows="2"
            type="textarea"
          />
        </el-form-item>
      </el-col>

      <JobFormScheduleExtrasFields v-model:form="form" :job-params-example="jobParamsExample" />
    </el-row>
  </el-form>
</template>
