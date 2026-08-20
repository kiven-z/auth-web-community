<script lang="ts" setup>
import type { FormDialog } from '@/shared/types/dialog';
import type { SysJobCreateForm } from '@/features/schedule/api/job';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import JobCatalogClassPicker from '@/features/schedule/schedule-task/components/JobCatalogClassPicker.vue';
import JobFormScheduleExtrasFields from '@/features/schedule/schedule-task/components/JobFormScheduleExtrasFields.vue';
import useBeanInvokePicker from '@/features/schedule/schedule-task/hooks/useBeanInvokePicker';
import useJobCatalog from '@/features/schedule/schedule-task/hooks/useJobCatalog';
import useJobGroupRemoteSearch from '@/features/schedule/schedule-task/hooks/useJobGroupRemoteSearch';
import useJobFormOptions from '@/features/schedule/schedule-task/hooks/options/useJobFormOptions';
import type { FormInstance, FormRules } from 'element-plus';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'JobCreateFormDialog',
});

type JobCreateFormDialogProps = FormDialog<SysJobCreateForm>;

const props = withDefaults(defineProps<JobCreateFormDialogProps>(), {
  form: () => ({}) as SysJobCreateForm,
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { taskTypeOptions } = useJobFormOptions();
const formRef = ref<FormInstance>();

const form = ref<SysJobCreateForm>({
  taskType: 'BEAN_INVOKE',
  misfirePolicy: 3,
  concurrent: false,
  status: true,
  timeZone: 'Asia/Shanghai',
  ...props.form,
});

const { jobGroupOptions, loadingJobGroups, loadJobGroupByKeyword } = useJobGroupRemoteSearch();
const { catalogByMode, findJobParamsExample, loadCatalogClasses } = useJobCatalog();
const {
  selectedBeanClass,
  selectedBeanMethod,
  catalogMethods,
  loadingMethods,
  reset: resetBeanInvokePicker,
} = useBeanInvokePicker(form);

const isBeanInvoke = computed(() => form.value.taskType === 'BEAN_INVOKE');
const isCustomClass = computed(() => form.value.taskType === 'CUSTOM_CLASS');

const jobParamsExample = computed(() => {
  if (!isCustomClass.value || !form.value.jobClass) {
    return undefined;
  }
  return findJobParamsExample(form.value.jobClass);
});

const rules = computed<FormRules>(() => ({
  jobName: [
    { required: true, message: ph.input('scheduleTask.fields.jobName'), trigger: 'blur' },
    { max: 64, message: t('scheduleTask.validation.jobNameLengthLimit'), trigger: 'blur' },
  ],
  jobGroup: [{ required: true, message: ph.select('scheduleTask.fields.jobGroup'), trigger: 'change' }],
  taskType: [{ required: true, message: ph.select('scheduleTask.fields.taskType'), trigger: 'change' }],
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

  ...(isCustomClass.value
    ? { jobClass: [{ required: true, message: ph.select('scheduleTask.fields.jobClass'), trigger: 'change' }] }
    : {}),
}));

watch(
  () => form.value.taskType,
  (taskType) => {
    if (taskType === 'BEAN_INVOKE') {
      form.value.jobClass = undefined;
      form.value.jobParams = undefined;
      return;
    }
    if (taskType === 'CUSTOM_CLASS') {
      form.value.invokeTarget = undefined;
      resetBeanInvokePicker();
    }
  }
);

watch(
  () => form.value.jobClass,
  (className) => {
    if (!isCustomClass.value || !className) {
      return;
    }
    const example = findJobParamsExample(className);
    if (!example) {
      return;
    }

    form.value.jobParams = JSON.stringify(JSON.parse(example), null, 2);
  }
);

onMounted(() => {
  void loadJobGroupByKeyword(undefined);
  void loadCatalogClasses();
});

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <el-row :gutter="14">
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="t('scheduleTask.fields.jobName')" prop="jobName">
          <el-input v-model="form.jobName" :placeholder="ph.input('scheduleTask.fields.jobName')" />
        </el-form-item>
      </el-col>
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="t('scheduleTask.fields.jobGroup')" prop="jobGroup">
          <el-select
            v-model="form.jobGroup"
            :loading="loadingJobGroups"
            :placeholder="ph.select('scheduleTask.fields.jobGroup')"
            :remote-method="loadJobGroupByKeyword"
            class="w-full"
            filterable
            remote
          >
            <el-option
              v-for="item in jobGroupOptions"
              :key="item.id"
              :label="`${item.groupName} (${item.groupCode})`"
              :value="item.groupCode"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="t('scheduleTask.fields.taskType')" prop="taskType">
          <el-select v-model="form.taskType" :placeholder="ph.select('scheduleTask.fields.taskType')" class="w-full">
            <el-option v-for="opt in taskTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </el-form-item>
      </el-col>

      <template v-if="isBeanInvoke">
        <el-col :span="24">
          <el-form-item :label="t('scheduleTask.beanInvoke.class')">
            <JobCatalogClassPicker
              v-model="selectedBeanClass"
              :options="catalogByMode.BEAN_INVOKE"
              :placeholder="ph.select('scheduleTask.beanInvoke.class')"
            />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="12" :sm="24" :xs="24">
          <el-form-item :label="t('scheduleTask.beanInvoke.method')">
            <el-select
              v-model="selectedBeanMethod"
              :disabled="!selectedBeanClass"
              :loading="loadingMethods"
              :placeholder="ph.select('scheduleTask.beanInvoke.method')"
              class="w-full"
              clearable
              filterable
            >
              <el-option
                v-for="item in catalogMethods"
                :key="`${item.methodName}:${item.parameterSignature}`"
                :label="`${item.methodName}${item.parameterSignature}`"
                :value="`${item.methodName}:${item.parameterSignature}`"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="t('scheduleTask.fields.invokeTarget')" prop="invokeTarget">
            <el-input
              v-model="form.invokeTarget"
              :placeholder="ph.input('scheduleTask.fields.invokeTarget')"
              :rows="2"
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </template>

      <template v-if="isCustomClass">
        <el-col :span="24">
          <el-form-item :label="t('scheduleTask.fields.jobClass')" prop="jobClass">
            <JobCatalogClassPicker
              v-model="form.jobClass"
              :options="catalogByMode.CUSTOM_CLASS"
              :placeholder="ph.select('scheduleTask.fields.jobClass')"
            />
          </el-form-item>
        </el-col>
      </template>

      <JobFormScheduleExtrasFields v-model:form="form" :job-params-example="jobParamsExample" />
    </el-row>
  </el-form>
</template>
