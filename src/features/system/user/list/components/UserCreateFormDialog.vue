<script lang="ts" setup>
import type { FormDialog } from '@/shared/types/dialog';
import type { SysUserCreateForm } from '@/features/system/api/user/user';
import { passwordComplexityRule } from '@/components/domain/user/change-password-dialog';
import { USER_ACCOUNT_STATUS, USER_GENDER } from '@/components/domain/system/constants/user-enums';
import useUserStatus from '@/components/domain/system/status/use-user-status';
import { useOverlayConfirm } from '@/components/ui/overlay';
import type { FormInstance, FormRules } from 'element-plus';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'UserCreateFormDialog' });

const props = withDefaults(defineProps<FormDialog<SysUserCreateForm>>(), {
  form: () => ({}) as SysUserCreateForm,
});

const { t } = useI18n();
const confirmOverlay = useOverlayConfirm();
const { statusFilterOptions: userStatusOptions, genderOptions: userGenderOptions } = useUserStatus();
const formRef = ref<FormInstance>();
const form = ref<SysUserCreateForm>({
  status: USER_ACCOUNT_STATUS.normal,
  gender: USER_GENDER.unknown,
  ...props.form,
});

const rules = computed<FormRules>(() => ({
  username: [
    { required: true, message: t('users.field.username'), trigger: 'blur' },
    { max: 64, message: t('users.validation.usernameMaxLength'), trigger: 'blur' },
  ],
  initialPassword: [{ required: true, message: t('users.password.initial'), trigger: 'blur' }, passwordComplexityRule],
  email: [
    { required: true, message: t('users.field.email'), trigger: 'blur' },
    { type: 'email', message: t('users.validation.emailInvalid'), trigger: 'blur' },
    { max: 128, message: t('users.validation.emailMaxLength'), trigger: 'blur' },
  ],
  employeeNo: [{ max: 64, message: t('users.validation.employeeNoMaxLength'), trigger: 'blur' }],
  status: [{ required: true, message: t('users.field.status'), trigger: 'change' }],
  nickname: [
    { required: true, message: t('users.field.nickname'), trigger: 'blur' },
    { max: 64, message: t('users.validation.nicknameMaxLength'), trigger: 'blur' },
  ],
  phone: [
    { required: true, message: t('users.field.phone'), trigger: 'blur' },
    { max: 32, message: t('users.validation.phoneMaxLength'), trigger: 'blur' },
  ],
  remark: [{ max: 500, message: t('users.validation.remarkMaxLength'), trigger: 'blur' }],
}));

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" v-enter-submit="() => confirmOverlay?.()" :model="form" :rules="rules" label-width="auto">
    <el-row :gutter="14">
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('users.field.username')" prop="username">
          <el-input v-model="form.username" :placeholder="t('users.field.username')" clearable />
        </el-form-item>
      </el-col>
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('users.password.initial')" prop="initialPassword">
          <el-input
            v-model="form.initialPassword"
            :placeholder="t('users.password.initial')"
            autocomplete="new-password"
            clearable
            show-password
            type="password"
          />
        </el-form-item>
      </el-col>
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('users.field.nickname')" prop="nickname">
          <el-input v-model="form.nickname" :placeholder="t('users.field.nickname')" clearable />
        </el-form-item>
      </el-col>
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('users.field.email')" prop="email">
          <el-input v-model="form.email" :placeholder="t('users.field.email')" clearable />
        </el-form-item>
      </el-col>
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('users.field.phone')" prop="phone">
          <el-input v-model="form.phone" :placeholder="t('users.field.phone')" clearable />
        </el-form-item>
      </el-col>
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('relation.employeeNo')" prop="employeeNo">
          <el-input v-model="form.employeeNo" :placeholder="t('relation.employeeNo')" clearable />
        </el-form-item>
      </el-col>
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('users.field.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="opt in userStatusOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('users.field.gender')" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio v-for="opt in userGenderOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :lg="12" :md="12" :sm="12" :xs="24">
        <el-form-item :label="t('users.field.birthday')" prop="birthday">
          <el-date-picker
            v-model="form.birthday"
            :placeholder="t('users.field.birthday')"
            class="w-full!"
            clearable
            type="date"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="t('users.field.introduction')" prop="introduction">
          <el-input
            v-model="form.introduction"
            :placeholder="t('users.field.introduction')"
            :rows="3"
            maxlength="500"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="t('users.field.remark')" prop="remark">
          <el-input
            v-model="form.remark"
            :placeholder="t('users.field.remark')"
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
