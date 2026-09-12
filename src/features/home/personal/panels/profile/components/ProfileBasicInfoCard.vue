<script lang="ts" setup>
import useUserStatus from '@/components/domain/user/user-status';
import type { SysUserDetail } from '@/features/system/api/user/user-base';
import { type MeProfileUpdateRequest, updateMyProfile } from '@/features/system/api/user/user-me';
import { multiConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import { type FormInstance, type FormRules } from 'element-plus';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'ProfileBasicInfoCard',
});

const props = defineProps<{
  profile: SysUserDetail;
}>();

const emit = defineEmits<{
  saved: [updatedProfile: MeProfileUpdateRequest];
}>();

const { t } = useI18n();
const { genderOptions: userGenderOptions } = useUserStatus();
const formRef = ref<FormInstance>();
const submitting = ref(false);
const initialEmail = ref<string | null | undefined>(props.profile.email);
const initialPhone = ref<string | null | undefined>(props.profile.phone);

const form = ref<MeProfileUpdateRequest>({
  nickname: props.profile.nickname,
  email: props.profile.email,
  phone: props.profile.phone,
  gender: props.profile.gender,
  birthday: props.profile.birthday,
  introduction: props.profile.introduction,
});

const rules = computed<FormRules>(() => ({
  nickname: [
    { required: true, message: t('users.field.nickname'), trigger: 'blur' },
    { max: 64, message: t('users.validation.nicknameMaxLength'), trigger: 'blur' },
  ],
  email: [
    { required: true, message: t('users.field.email'), trigger: 'blur' },
    { type: 'email', message: t('users.validation.emailInvalid'), trigger: 'blur' },
    { max: 128, message: t('users.validation.emailMaxLength'), trigger: 'blur' },
  ],
  phone: [
    { required: true, message: t('users.field.phone'), trigger: 'blur' },
    { max: 32, message: t('users.validation.phoneMaxLength'), trigger: 'blur' },
  ],
}));

/**
 * 重置表单为当前档案
 */
function resetForm() {
  Object.assign(form.value, {
    nickname: props.profile.nickname,
    email: props.profile.email,
    phone: props.profile.phone,
    gender: props.profile.gender,
    birthday: props.profile.birthday,
    introduction: props.profile.introduction,
  });
  initialEmail.value = props.profile.email;
  initialPhone.value = props.profile.phone;
  formRef.value?.resetFields();
}

/**
 * 在修改联系方式前提示会话将全部下线
 */
async function confirmContactFieldChange(): Promise<boolean> {
  if (!(form.value.email !== initialEmail.value || form.value.phone !== initialPhone.value)) {
    return true;
  }

  return multiConfirm([
    {
      title: t('account.hint.contactChangeTitle'),
      message: t('account.hint.contactChangeSessionRevoke'),
    },
  ]);
}

/**
 * 校验并提交资料更新
 */
async function handleSave() {
  if (!formRef.value) {
    return;
  }

  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) {
    return;
  }

  const confirmed = await confirmContactFieldChange();
  if (!confirmed) {
    return;
  }

  submitting.value = true;
  try {
    await updateMyProfile(form.value);
    message(t('tips.editSuccess'), { type: 'success' });

    initialEmail.value = form.value.email;
    initialPhone.value = form.value.phone;

    emit('saved', { ...form.value });
  } catch (error: unknown) {
    errorMessage(error);
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <section class="profile-basic-info-card">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
      <el-row>
        <el-col :lg="12" :md="12" :sm="12" :xs="24">
          <el-form-item :label="t('account.field.username')">
            <el-input :model-value="profile.username" disabled />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="12" :sm="12" :xs="24">
          <el-form-item :label="t('account.field.employeeNo')">
            <el-input :model-value="profile.employeeNo" disabled />
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
              :disabled-date="(date) => date.getTime() > Date.now()"
              :placeholder="t('users.field.birthday')"
              class="profile-basic-info-card__date-picker"
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
      </el-row>

      <div class="profile-basic-info-card__actions">
        <el-button :loading="submitting" type="primary" @click="handleSave">{{ t('account.action.save') }}</el-button>
        <el-button @click="resetForm">{{ t('account.action.reset') }}</el-button>
      </div>
    </el-form>
  </section>
</template>

<style lang="scss" scoped>
.profile-basic-info-card {
  &__actions {
    display: flex;
    justify-content: flex-end;
  }

  &__date-picker {
    width: 100%;
  }
}
</style>
