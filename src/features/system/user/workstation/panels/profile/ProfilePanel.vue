<script lang="ts" setup>
import useUserStatus from '@/components/domain/system/status/use-user-status';
import { type SysUserUpdateForm, updateUser } from '@/features/system/api/user/user';
import { getUserDetail, type SysUserDetail } from '@/features/system/api/user/user-base';
import { WORKSTATION_PROFILE_KEY } from '@/features/system/user/workstation/hooks/shell/use-workstation-profile-context';
import AvatarUpdatePanel from '@/features/system/user/workstation/panels/profile/AvatarUpdatePanel.vue';
import { errorMessage, message } from '@/services/feedback/message';
import type { FormInstance, FormRules } from 'element-plus';
import { computed, inject, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

defineOptions({ name: 'UserWorkstationProfilePanel' });

const { t } = useI18n();
const { statusFilterOptions: userStatusOptions, genderOptions: userGenderOptions } = useUserStatus();
const route = useRoute();
const workstationProfile = inject(WORKSTATION_PROFILE_KEY, null);

const loading = ref(false);
const submitting = ref(false);
const profile = ref<SysUserDetail | null>(null);
const formRef = ref<FormInstance>();
const form = ref({} as SysUserUpdateForm);
/** 上次加载/保存成功的快照，供重置 */
const snapshot = ref({} as SysUserUpdateForm);

const userId = computed(() => String(route.params.userId ?? ''));

const rules = computed<FormRules>(() => ({
  username: [
    { required: true, message: t('users.field.username'), trigger: 'blur' },
    { max: 64, message: t('users.validation.usernameMaxLength'), trigger: 'blur' },
  ],
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

/**
 * 将详情响应写入表单与快照
 * @param row 用户详情
 */
function applyProfileToForm(row: SysUserDetail) {
  const next = {
    id: row.id,
    username: row.username,
    nickname: row.nickname,
    email: row.email,
    phone: row.phone,
    employeeNo: row.employeeNo,
    status: row.status,
    gender: row.gender,
    birthday: row.birthday,
    introduction: row.introduction,
    remark: row.remark,
  } as SysUserUpdateForm;
  form.value = next;
  snapshot.value = { ...next };
}

/**
 * 拉取用户详情并填充表单
 */
async function loadProfile() {
  if (!userId.value) {
    profile.value = null;
    return;
  }

  loading.value = true;
  try {
    const row = await getUserDetail(userId.value);
    profile.value = row;
    applyProfileToForm(row);
  } catch (error: unknown) {
    errorMessage(error);
    profile.value = null;
  } finally {
    loading.value = false;
  }
}

/**
 * 重置为上次成功快照
 */
function resetForm() {
  form.value = { ...snapshot.value };
  formRef.value?.clearValidate();
}

/**
 * 校验并保存资料
 */
async function handleSave() {
  if (!formRef.value) {
    return;
  }

  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) {
    return;
  }

  submitting.value = true;
  try {
    await updateUser(form.value);
    message(t('tips.editSuccess'), { type: 'success' });
    snapshot.value = { ...form.value };
    if (profile.value) {
      profile.value = { ...profile.value, ...form.value };
    }
    workstationProfile?.patchProfile(form.value);
  } catch (error: unknown) {
    errorMessage(error);
  } finally {
    submitting.value = false;
  }
}

/**
 * 头像更新后同步本地面板展示
 * @param avatarUrl 新头像 URL
 */
function handleAvatarUpdated(avatarUrl: string) {
  if (!profile.value) {
    return;
  }
  profile.value = { ...profile.value, avatar: avatarUrl };
  workstationProfile?.patchProfile({ avatar: avatarUrl });
}

watch(userId, () => void loadProfile(), { immediate: true });
</script>

<template>
  <div v-loading="loading" class="profile-panel">
    <template v-if="profile">
      <el-divider content-position="left">{{ t('users.avatar.update') }}</el-divider>
      <AvatarUpdatePanel
        :avatar="profile.avatar"
        :user-id="profile.id"
        :username="profile.username"
        @success="handleAvatarUpdated"
      />

      <el-divider content-position="left">{{ t('account.field.basicInfo') }}</el-divider>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
        <el-row>
          <el-col :lg="12" :md="12" :sm="12" :xs="24">
            <el-form-item :label="t('users.field.username')" prop="username">
              <el-input v-model="form.username" :placeholder="t('users.field.username')" clearable />
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

        <div class="profile-panel__actions">
          <el-button :loading="submitting" type="primary" @click="handleSave">
            {{ t('account.action.save') }}
          </el-button>
          <el-button @click="resetForm">{{ t('account.action.reset') }}</el-button>
        </div>
      </el-form>
    </template>

    <el-empty v-else-if="!loading" :description="t('tips.requestFailed')" />
  </div>
</template>

<style lang="scss" scoped>
.profile-panel {
  &__actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
}
</style>
