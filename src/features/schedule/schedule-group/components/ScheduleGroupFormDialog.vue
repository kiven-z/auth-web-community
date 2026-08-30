<script lang="ts" setup>
import type { FormDialog } from '@/shared/types/dialog';
import type { CreateJobGroupRequest, UpdateJobGroupRequest } from '@/features/schedule/api/jobGroup';
import { useOverlayConfirm } from '@/components/ui/Overlay';
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/useCommonBooleanStatusOptions';
import type { FormInstance, FormRules } from 'element-plus';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'JobGroupFormDialog',
});

type JobGroupForm = CreateJobGroupRequest & UpdateJobGroupRequest;

interface ScheduleGroupFormDialogProps extends FormDialog<JobGroupForm> {
  mode?: 'add' | 'edit';
}

const props = withDefaults(defineProps<ScheduleGroupFormDialogProps>(), {
  form: () => ({}) as JobGroupForm,
  mode: 'add',
});

const { t } = useI18n();
const confirmOverlay = useOverlayConfirm();
const booleanStatusOptions = useCommonBooleanStatusOptions();
const formRef = ref<FormInstance>();

const form = ref<JobGroupForm>({
  status: true,
  orderNum: 0,
  ...props.form,
});

const rules = computed<FormRules>(() => ({
  groupCode: [
    { required: true, message: t('scheduleGroup.placeholder.code'), trigger: 'blur' },
    {
      pattern: /^[A-Z0-9_]+$/,
      message: t('scheduleGroup.placeholder.code'),
      trigger: 'blur',
    },
  ],
  groupName: [{ required: true, message: t('scheduleGroup.placeholder.name'), trigger: 'blur' }],
  status: [{ required: true, message: t('scheduleGroup.placeholder.status'), trigger: 'change' }],
  orderNum: [{ required: true, message: t('scheduleGroup.placeholder.orderNum'), trigger: 'blur' }],
}));

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" v-enter-submit="() => confirmOverlay?.()" :model="form" :rules="rules" label-width="120px">
    <el-row :gutter="14">
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item v-if="mode === 'add'" :label="t('scheduleGroup.code')" prop="groupCode">
          <el-input v-model="form.groupCode" :placeholder="t('scheduleGroup.placeholder.code')" />
        </el-form-item>
        <el-form-item v-else :label="t('scheduleGroup.code')">
          <el-input v-model="form.groupCode" disabled />
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="t('scheduleGroup.name')" prop="groupName">
          <el-input v-model="form.groupName" />
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="t('scheduleGroup.orderNum')" prop="orderNum">
          <el-input-number v-model="form.orderNum" :min="0" class="w-full!" />
        </el-form-item>
      </el-col>

      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <el-form-item :label="t('scheduleGroup.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="opt in booleanStatusOptions" :key="String(opt.value)" :value="opt.value">
              {{ opt.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="t('scheduleGroup.description')" prop="description">
          <el-input v-model="form.description" :rows="2" type="textarea" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
