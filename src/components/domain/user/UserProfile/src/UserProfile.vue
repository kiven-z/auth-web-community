<script lang="ts" setup>
import { getUserProfile } from '@/features/system/api/user/userBase';
import { getUserDeptPage, type UserDeptPageRow } from '@/features/system/api/user/userDept';
import { getUserPostPage, type UserPostPageRow } from '@/features/system/api/user/userPost';
import useUserProfileColumns from './hooks/useUserProfileColumns';
import Description from '@/components/ui/Description';
import { errorMessage } from '@/services/feedback/message';
import { QuestionFilled, User } from '@element-plus/icons-vue';
import type { PropType } from 'vue';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'UserProfile' });

const props = defineProps({
  userId: { type: String as PropType<string | undefined>, required: false },
});

const { t } = useI18n();

const { userColumns, deptColumns, postColumns } = useUserProfileColumns();

const loading = ref(false);
const userDetailInfo = ref<Record<string, unknown>[]>([]);
const deptInfos = ref<UserDeptPageRow[]>([]);
const postInfos = ref<UserPostPageRow[]>([]);
const deptCount = ref(0);
const postCount = ref(0);

const PROFILE_RELATION_PAGE_SIZE = 50;

/**
 * 按 userId 拉取用户档案与部门、岗位分页（快览，非全量）
 */
async function loadUserDetailInfo() {
  if (!props.userId) {
    userDetailInfo.value = [];
    deptInfos.value = [];
    postInfos.value = [];
    deptCount.value = 0;
    postCount.value = 0;
    return;
  }

  loading.value = true;
  try {
    const [profile, deptPage, postPage] = await Promise.all([
      getUserProfile(props.userId),
      getUserDeptPage(props.userId, { pageIndex: 1, pageSize: PROFILE_RELATION_PAGE_SIZE }),
      getUserPostPage(props.userId, { pageIndex: 1, pageSize: PROFILE_RELATION_PAGE_SIZE }),
    ]);
    const { deptCount: nextDeptCount, postCount: nextPostCount, ...userRow } = profile;
    userDetailInfo.value = [userRow as Record<string, unknown>];
    deptCount.value = Number(nextDeptCount ?? deptPage.total ?? 0);
    postCount.value = Number(nextPostCount ?? postPage.total ?? 0);
    deptInfos.value = deptPage.list ?? [];
    postInfos.value = postPage.list ?? [];
  } catch (error: unknown) {
    errorMessage(error);
    userDetailInfo.value = [];
    deptInfos.value = [];
    postInfos.value = [];
    deptCount.value = 0;
    postCount.value = 0;
  } finally {
    loading.value = false;
  }
}

const displayDeptCount = computed(() => deptCount.value);
const displayPostCount = computed(() => postCount.value);

watch(
  () => props.userId,
  () => {
    void loadUserDetailInfo();
  },
  { immediate: true }
);
</script>

<template>
  <div class="user-dept-info-container">
    <div class="section">
      <div class="section-header">
        <h3 class="section-title">{{ t('users.section.baseInfo') }}</h3>
        <el-tag type="primary">{{ t('users.section.profile') }}</el-tag>
      </div>
      <Description
        v-loading="loading"
        :column="2"
        :columns="userColumns"
        :data="userDetailInfo"
        border
        class="mb-4 overflow-x-auto"
      />
    </div>

    <div class="section">
      <div class="section-header">
        <h4 class="section-title">{{ t('relation.section.dept') }}</h4>
        <el-badge :hidden="displayDeptCount <= 0" :value="displayDeptCount" class="badge" type="success" />
      </div>

      <el-empty v-if="deptInfos.length === 0 && !loading" :description="t('users.tips.noDeptInfo')" :image-size="100" />

      <el-collapse v-else accordion>
        <el-collapse-item v-for="dept in deptInfos" :key="dept.id" :name="dept.id" :title="dept.deptName">
          <Description v-loading="loading" :column="2" :columns="deptColumns" :data="dept ?? {}" border row-key="id" />
        </el-collapse-item>
      </el-collapse>
    </div>

    <el-divider>
      <div class="divider-content">
        <el-icon>
          <User />
        </el-icon>
        <span>{{ t('users.section.postInfo') }}</span>
        <el-tooltip :content="t('users.tips.showUserPostInfoTip')" placement="top">
          <el-icon>
            <QuestionFilled />
          </el-icon>
        </el-tooltip>
      </div>
    </el-divider>

    <div class="section">
      <div class="section-header">
        <h4 class="section-title">{{ t('post.tips.affiliatedPostInfo') }}</h4>
        <el-badge :hidden="displayPostCount <= 0" :value="displayPostCount" class="badge" type="warning" />
      </div>

      <el-empty
        v-if="postInfos.length === 0 && !loading"
        :description="t('users.tips.currentUserHasNotPostInfo')"
        :image-size="100"
      />

      <el-collapse v-else accordion>
        <el-collapse-item v-for="post in postInfos" :key="post.id" :name="post.id" :title="post.postName">
          <Description v-loading="loading" :column="2" :columns="postColumns" :data="post ?? {}" border />
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'index';
</style>
