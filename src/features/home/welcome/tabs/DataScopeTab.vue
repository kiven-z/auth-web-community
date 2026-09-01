<script lang="ts" setup>
import ListTable, { usePaginationState } from '@/components/table/list-table';
import Description, { type ColumnProps } from '@/components/ui/description';
import {
  getExampleMe,
  queryExampleOrderPage,
  type ExampleAuthProfile,
  type ExampleOrderPageQuery,
  type ExampleOrderRow,
} from '@/features/home/welcome/api/example';
import { errorMessage } from '@/services/feedback/message';
import type { FormInstance } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';

defineOptions({
  name: 'WelcomeDataScopeTab',
});

const profileLoading = ref(false);
const profile = ref<ExampleAuthProfile | null>(null);
const searchFormRef = ref<FormInstance>();

const profileColumns: ColumnProps[] = [
  { label: '用户 ID', prop: 'userId', labelWidth: 120, copy: true },
  { label: '用户名', prop: 'username', labelWidth: 120, copy: true },
  { label: 'permVersion', prop: 'permVersion', labelWidth: 120, copy: true },
  { label: '数据范围类型', prop: 'deptScopeType', labelWidth: 120 },
  { label: '数据范围取值', prop: 'deptScopeValues', labelWidth: 120, span: 2 },
  { label: '角色', prop: 'roles', labelWidth: 120, span: 2 },
];

const profileDisplayData = computed(() => {
  const current = profile.value;
  if (!current) {
    return null;
  }
  const scopeValues = current.deptScope?.values;
  return {
    userId: current.userId,
    username: current.username,
    permVersion: current.permVersion,
    deptScopeType: current.deptScope?.scopeType,
    deptScopeValues: scopeValues?.length ? scopeValues.join(', ') : undefined,
    roles: current.roles?.length ? current.roles.join(', ') : undefined,
  };
});

const orderColumns: TableColumnList = [
  { type: 'index', index: (index: number) => index + 1, label: '序号', width: 60 },
  { label: 'ID', prop: 'id', width: 100 },
  { label: '标题', minWidth: 160, prop: 'title', showOverflowTooltip: true },
  { label: '部门 ID', prop: 'deptId', width: 120 },
  { label: '创建人', prop: 'createdBy', width: 120 },
];

const orderState = usePaginationState<ExampleOrderRow, ExampleOrderPageQuery>({
  fetchApi: queryExampleOrderPage,
  searchForm: reactive({
    id: undefined,
    title: undefined,
    deptId: undefined,
  }),
  defaultPageSize: 10,
});

const { fetchTableData, resetQuery, loading: orderLoading, searchForm } = orderState;

/**
 * 拉取当前授权画像
 */
async function reloadProfile() {
  profileLoading.value = true;
  try {
    profile.value = await getExampleMe();
  } catch (error: unknown) {
    errorMessage(error);
    profile.value = null;
  } finally {
    profileLoading.value = false;
  }
}

/**
 * 刷新画像与订单表
 */
async function reloadAll() {
  await reloadProfile();
  await fetchTableData();
}

onMounted(() => {
  void reloadAll();
});
</script>

<template>
  <div class="data-scope-tab">
    <div class="data-scope-tab__toolbar">
      <ul class="data-scope-tab__hints">
        <li>
          切换演示账号（如 north_chen、east_zhao）重新登录后点「刷新」，对照 harness
          <code>dept_scope_list_cases.yml</code>
          期望 ID。
        </li>
        <li>线上演示不一定部署 service-example 服务</li>
      </ul>
      <el-button
        :loading="profileLoading || orderLoading"
        class="data-scope-tab__refresh"
        type="primary"
        @click="reloadAll"
      >
        刷新
      </el-button>
    </div>

    <div v-loading="profileLoading" class="data-scope-tab__profile">
      <Description
        v-if="profileDisplayData"
        :column="2"
        :columns="profileColumns"
        :data="profileDisplayData"
        placeholder="—"
        title="当前授权画像"
      />
    </div>

    <div class="data-scope-tab__table-wrap">
      <el-form
        ref="searchFormRef"
        v-enter-submit="fetchTableData"
        :model="searchForm"
        class="data-scope-tab__search"
        inline
      >
        <el-form-item label="订单 ID" prop="id">
          <el-input v-model="searchForm.id" class="w-36!" clearable placeholder="精确匹配" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="searchForm.title" class="w-45!" clearable placeholder="模糊匹配" />
        </el-form-item>
        <el-form-item label="部门 ID" prop="deptId">
          <el-input v-model="searchForm.deptId" class="w-36!" clearable placeholder="精确匹配" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="orderLoading" type="primary" @click="fetchTableData">查询</el-button>
          <el-button @click="resetQuery(searchFormRef)">重置</el-button>
        </el-form-item>
      </el-form>

      <ListTable :columns="orderColumns" :state="orderState" title="订单-数据权限Demo" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.data-scope-tab {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__toolbar {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    justify-content: space-between;
  }

  &__hints {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    padding-left: 1.25em;
    margin: 0;
    list-style: disc;

    li {
      font-size: var(--auth-font-size-large);
      line-height: 1.5;
      color: var(--auth-text-placeholder);

      code {
        font-family: var(--auth-font-family-mono, monospace), serif;
        font-size: var(--auth-font-size-large);
      }
    }
  }

  &__refresh {
    flex-shrink: 0;
  }

  &__profile {
    width: 100%;
  }

  &__table-wrap {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__search {
    padding-top: 0;
  }
}
</style>
