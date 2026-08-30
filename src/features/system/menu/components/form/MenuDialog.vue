<script lang="ts" setup>
import type { MenuFormModel } from '@/features/system/api/menu/menu';
import { getMenuList } from '@/features/system/api/menu/menu';
import { transformI18n } from '@/app/plugins/i18n';
import AnimateSelector from '@/features/system/menu/components/form/AnimateSelector.vue';
import { IconSelect, useRenderIcon } from '@/components/ui/Icon';
import { errorMessage } from '@/services/feedback/message';
import { handleTree, TREE_ROOT_PARENT_ID } from '@/shared/utils/tree';
import MenuTypeIframeDialog from '@/features/system/menu/components/form/MenuTypeIframeDialog.vue';
import MenuTypeLinkDialog from '@/features/system/menu/components/form/MenuTypeLinkDialog.vue';
import MenuTypeMenuDialog from '@/features/system/menu/components/form/MenuTypeMenuDialog.vue';
import { MenuTypeEnums } from '@/features/system/_shared/constants/menu-type';
import { useMenuTypeOptions } from '@/features/system/_shared/hooks/options/useMenuTypeOptions';
import { findMenuIdPath } from '@/features/system/menu/utils/menu-tree';
import type { CascaderProps, FormInstance, FormRules } from 'element-plus';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

interface MenuDialogProps {
  isFormDisabled?: boolean;
  /** 预填字段；未传字段由弹窗内默认值补齐 */
  form?: Partial<MenuFormModel>;
}

interface DeptNode {
  id: string;
  value: string;
  parentId: string | null;
  label: string;
  name: string;
  children?: DeptNode[];
}

type MenuCollapseSection = 'basic' | 'route' | 'animation';

const props = withDefaults(defineProps<MenuDialogProps>(), {
  isFormDisabled: false,
  form: () => ({}) as MenuFormModel,
});

/** 菜单图标仅允许 ri/*、ep/* */
const ALLOWED_ICON_PREFIXES = ['ri/', 'ep/'] as const;

/**
 * 非允许集合时清空
 * @param icon 图标字符串
 * @returns 合法键或空串
 */
function sanitizeMenuIcon(icon: string | undefined | null): string {
  const iconValue = (icon ?? '').trim();
  if (!iconValue) {
    return '';
  }
  const lower = iconValue.toLowerCase();
  return ALLOWED_ICON_PREFIXES.some((prefix) => lower.startsWith(prefix)) ? iconValue : '';
}

const { t } = useI18n();
const menuTypeOptions = useMenuTypeOptions();

const formRef = ref<FormInstance>();
const form = ref<MenuFormModel>({
  parentId: TREE_ROOT_PARENT_ID,
  menuType: MenuTypeEnums.MENU,
  menuRank: 0,
  showLink: true,
  publicAccess: false,
  showParent: true,
  keepAlive: false,
  status: true,
  hiddenTag: false,
  fixedTag: false,
  frameLoading: true,
  dynamicLevel: 1,
  ...props.form,
  icon: sanitizeMenuIcon(props.form?.icon),
  extraIcon: sanitizeMenuIcon(props.form?.extraIcon),
} as MenuFormModel);

const animationType = ref<'all' | 'detail'>('all');
const activeCollapseNames = ref<MenuCollapseSection[]>(['basic']);

const rules = computed<FormRules>(() => ({
  menuType: [{ required: true, message: t('menus.rules.menuType'), trigger: 'change' }],
  title: [{ required: true, message: t('menus.rules.title'), trigger: 'blur' }],
  name: [{ required: true, message: t('menus.rules.name'), trigger: 'blur' }],
  path: [{ required: true, message: t('menus.rules.path'), trigger: 'blur' }],
}));

const menuCascaderProps: CascaderProps = {
  checkStrictly: true,
  emitPath: true,
};

const deptTree = ref<DeptNode[]>([]);
const parentIdPath = ref<string[]>([]);

const typeSegmentOptions = computed(() =>
  menuTypeOptions.value.map((item) => ({ label: item.label, value: item.value }))
);

/**
 * 加载扁平菜单并构造父级级联树
 */
const loadMenuTree = async () => {
  try {
    const list = await getMenuList({});
    const nodes = (list ?? []).map((item) => ({
      id: item.id,
      value: item.id,
      parentId: item.parentId,
      label: transformI18n(item.title),
      name: item.name,
    }));
    deptTree.value = handleTree(nodes, 'id', 'parentId', 'children') as DeptNode[];
    parentIdPath.value = findMenuIdPath(deptTree.value, form.value.parentId ?? null);
  } catch (e: unknown) {
    errorMessage(e);
    deptTree.value = [];
  }
};

watch(parentIdPath, (path) => {
  const next = path.length ? path[path.length - 1]! : null;
  const cur = form.value.parentId ?? null;
  if (next !== cur) {
    form.value.parentId = next;
  }
});

onMounted(() => {
  loadMenuTree();
});

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-position="top" label-width="auto">
    <el-collapse v-model="activeCollapseNames" class="menu-form-collapse">
      <el-collapse-item :title="t('menus.sections.basic')" name="basic">
        <el-form-item :label="t('menus.menuType')" prop="menuType">
          <el-segmented v-model="form.menuType" :options="typeSegmentOptions" class="w-full" />
        </el-form-item>

        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item :label="t('menus.parentId')" prop="parentId">
              <el-cascader
                v-model="parentIdPath"
                :debounce="400"
                :disabled="isFormDisabled"
                :options="deptTree"
                :placeholder="t('menus.placeholder.parentId')"
                :props="menuCascaderProps"
                class="w-full"
                clearable
                filterable
                separator="/"
              >
                <template #default="{ node, data: { name } }">
                  {{ node.label }}
                  <el-text v-show="name" type="info">({{ name }})</el-text>
                </template>
              </el-cascader>
            </el-form-item>
          </el-col>

          <el-col :lg="8" :md="12" :sm="12" :xs="24">
            <el-form-item :label="t('menus.dialogTitle')" prop="title">
              <el-input
                v-model="form.title"
                :disabled="isFormDisabled"
                :placeholder="t('menus.placeholder.title')"
                clearable
              />
              <el-text type="info">🌐I18n：{{ transformI18n(form.title) }}</el-text>
            </el-form-item>
          </el-col>

          <el-col :lg="8" :md="12" :sm="12" :xs="24">
            <el-form-item
              v-if="form.menuType === MenuTypeEnums.EXTERNAL_LINK"
              :label="t('menus.outsideChainName')"
              prop="name"
            >
              <el-input
                v-model="form.name"
                :disabled="isFormDisabled"
                :placeholder="t('menus.placeholder.outsideChainName')"
                clearable
              />
            </el-form-item>

            <el-form-item v-else :label="t('menus.dialogName')" prop="name">
              <el-input
                v-model="form.name"
                :disabled="isFormDisabled"
                :placeholder="t('menus.placeholder.routerName')"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :lg="8" :md="12" :sm="12" :xs="24">
            <el-form-item :label="t('menus.dialogPath')" prop="path">
              <el-input
                v-model="form.path"
                :disabled="isFormDisabled"
                :placeholder="t('menus.placeholder.path')"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :lg="8" :md="12" :sm="12" :xs="24">
            <el-form-item :label="t('menus.menuRank')" prop="menuRank">
              <el-input-number
                v-model="form.menuRank"
                :disabled="isFormDisabled"
                :min="0"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <el-col :lg="8" :md="12" :sm="12" :xs="24">
            <el-form-item :label="t('menus.icon')" prop="icon">
              <div class="flex w-full flex-col gap-2">
                <div v-if="form.icon" class="flex items-center gap-2">
                  <component :is="useRenderIcon(form.icon)" class="shrink-0 text-lg" />
                  <span class="text-xs text-(--el-text-color-secondary)">{{ form.icon }}</span>
                </div>
                <IconSelect v-model="form.icon" class="w-full!" />
              </div>
            </el-form-item>
          </el-col>

          <el-col :lg="8" :md="12" :sm="12" :xs="24">
            <el-form-item :label="t('menus.rightExtraIcon')" prop="extraIcon">
              <div class="flex w-full flex-col gap-2">
                <div v-if="form.extraIcon" class="flex items-center gap-2">
                  <component :is="useRenderIcon(form.extraIcon)" class="shrink-0 text-lg" />
                  <span class="text-xs text-(--el-text-color-secondary)">{{ form.extraIcon }}</span>
                </div>
                <IconSelect v-model="form.extraIcon" class="w-full!" />
              </div>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item :label="t('menus.remark')" prop="remark">
              <el-input
                v-model="form.remark"
                :disabled="isFormDisabled"
                :placeholder="t('menus.placeholder.remark')"
                :rows="3"
                maxlength="200"
                show-word-limit
                type="textarea"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-collapse-item>

      <el-collapse-item :title="t('menus.sections.route')" name="route">
        <menu-type-menu-dialog
          v-show="form.menuType === MenuTypeEnums.MENU"
          v-model:form="form"
          :formDisabled="isFormDisabled"
        />

        <menu-type-iframe-dialog
          v-show="form.menuType === MenuTypeEnums.IFRAME"
          v-model:form="form"
          :formDisabled="isFormDisabled"
        />

        <menu-type-link-dialog
          v-show="form.menuType === MenuTypeEnums.EXTERNAL_LINK"
          v-model:form="form"
          :formDisabled="isFormDisabled"
        />
      </el-collapse-item>

      <el-collapse-item :title="t('menus.sections.animation')" name="animation">
        <el-alert :closable="false" :title="t('menus.tips.animationAlert')" class="mb-4!" show-icon type="warning" />

        <el-radio-group v-model="animationType" class="mb-4">
          <el-radio-button value="all">{{ t('menus.tips.simpleAnimation') }}</el-radio-button>
          <el-radio-button value="detail">{{ t('menus.tips.detailAnimation') }}</el-radio-button>
        </el-radio-group>

        <el-form-item v-show="animationType === 'all'" :label="t('menus.transitionName')" prop="transitionName">
          <el-input
            v-model="form.transitionName"
            :disabled="isFormDisabled"
            :placeholder="t('menus.placeholder.transitionName')"
            clearable
          />
        </el-form-item>

        <el-row v-show="animationType === 'detail'" :gutter="16">
          <el-col :sm="12" :xs="24">
            <el-form-item :label="t('menus.enterTransition')" prop="enterTransition">
              <AnimateSelector
                v-model="form.enterTransition"
                :placeholder="t('menus.placeholder.enterTransition')"
                class="w-full"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item :label="t('menus.leaveTransition')" prop="leaveTransition">
              <AnimateSelector
                v-model="form.leaveTransition"
                :placeholder="t('menus.placeholder.leaveTransition')"
                class="w-full"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </el-form>
</template>

<style lang="scss" scoped>
.menu-form-collapse {
  /* 抵消 el-row 负边距，避免抽屉 overflow 裁切首列 label */
  :deep(.el-collapse-item__content) {
    padding: 4px 8px 16px;
    overflow: visible;
  }

  :deep(.el-collapse-item__header) {
    height: 48px;
    font-size: var(--el-font-size-large);
    font-weight: 800;
    line-height: 48px;
    color: var(--el-text-color-primary);
  }

  :deep(.el-form-item__label) {
    line-height: 1.4;
    white-space: normal;
  }
}
</style>
