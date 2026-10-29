<script lang="ts" setup>
import { getPostRolesPage, getPostUsersPage } from '@/features/system/api/post/post-authorization';
import SubjectBoundRolesPanel from '@/features/system/_shared/components/SubjectBoundRolesPanel.vue';
import SubjectBoundUsersPanel from '@/features/system/_shared/components/SubjectBoundUsersPanel.vue';
import { SYS_POST_PERMS } from '@/features/system/post/constants/permissions';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'PostAuthorizationSurfaceDrawer' });

/** 岗位授权面抽屉入参 */
interface PostAuthorizationSurfaceDrawerProps {
  postId: string;
}

type AuthorizationSurfaceTab = 'users' | 'roles';

defineProps<PostAuthorizationSurfaceDrawerProps>();

const { t } = useI18n();
const activeTab = ref<AuthorizationSurfaceTab>('users');
</script>

<template>
  <el-tabs v-model="activeTab">
    <el-tab-pane :label="t('post.bound.users.title')" lazy name="users">
      <SubjectBoundUsersPanel
        :fetch-page="(query) => getPostUsersPage(postId, query)"
        :query-perm="SYS_POST_PERMS.QUERY"
        :title="t('post.bound.users.title')"
      />
    </el-tab-pane>
    <el-tab-pane :label="t('post.bound.roles.title')" lazy name="roles">
      <SubjectBoundRolesPanel
        :fetch-page="(query) => getPostRolesPage(postId, query)"
        :query-perm="SYS_POST_PERMS.QUERY"
        :title="t('post.bound.roles.title')"
      />
    </el-tab-pane>
  </el-tabs>
</template>
