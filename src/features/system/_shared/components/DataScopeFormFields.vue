<script lang="ts" setup>
import type { DeptSelectTreeNode } from '@/components/domain/dept/dept-select-tree';
import type { SysDataScopeForm } from '@/features/system/api/models/data-scope';
import { deleteConfirm } from '@/services/feedback/dialog.ts';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'DataScopeFormFields' });

defineProps<{
  deptTree: DeptSelectTreeNode[];
}>();

const { t } = useI18n();

const dimensionCatalog = computed(() => ({
  DEPT: {
    tree: true,
    label: t('dataScope.dimension.dept'),
    scopeTypes: ['ALL', 'SELF', 'IDS', 'IDS_AND_CHILD'] as const,
  },
}));

const scopeTypeLabel = computed(() => ({
  ALL: t('dataScope.type.all'),
  SELF: t('dataScope.type.self'),
  IDS: t('dataScope.type.ids'),
  IDS_AND_CHILD: t('dataScope.type.idsAndChild'),
}));

const scopes = defineModel<SysDataScopeForm[]>({ required: true });

const selectedDimension = ref();
const openedDimensions = ref([]);

/**
 * 添加选中的维。已在列表中的维直接跳过
 */
function addDimension() {
  const dimension = selectedDimension.value;
  if (!dimension || scopes.value.some((row) => row.dimension === dimension)) {
    return;
  }
  scopes.value.push({
    dimension,
    scopeType: 'SELF',
    scopeIds: [],
  });
  openedDimensions.value = [...openedDimensions.value, dimension];
  selectedDimension.value = undefined;
}

/**
 * 从当前表单移除这一维
 * @param dimension 数据维
 */
async function removeDimension(dimension) {
  const promise = await deleteConfirm();
  if (!promise) {
    return;
  }

  scopes.value = scopes.value.filter((row) => row.dimension !== dimension);
  openedDimensions.value = openedDimensions.value.filter((item) => item !== dimension);
}

/**
 * 全部、仅本人不保留节点
 * @param row 当前维的表单行
 */
function onScopeTypeChange(row) {
  if (row.scopeType !== 'IDS' && row.scopeType !== 'IDS_AND_CHILD') {
    row.scopeIds = [];
  }
}
</script>

<template>
  <el-row>
    <el-col class="mb-2">
      <el-select-v2
        v-model="selectedDimension"
        :options="
          Object.keys(dimensionCatalog)
            .filter((dimension) => !scopes.some((row) => row.dimension === dimension))
            .map((dimension) => ({
              value: dimension,
              label: dimensionCatalog[dimension].label,
            }))
        "
        :placeholder="t('dataScope.dimension.placeholder')"
        class="w-60!"
      />
      <el-button :disabled="!selectedDimension" type="primary" @click="addDimension">
        {{ t('dataScope.action.add') }}
      </el-button>
    </el-col>

    <el-col v-if="scopes.length" class="my-2">
      <el-collapse v-model="openedDimensions" expand-icon-position="left">
        <el-collapse-item v-for="(row, index) in scopes" :key="row.dimension" :name="row.dimension">
          <template #title>
            <el-text tag="b" type="primary">{{ dimensionCatalog[row.dimension].label }}</el-text>
            -
            <el-text type="success" class="data-scope-form-fields__summary">
              {{ scopeTypeLabel[row.scopeType] }}
            </el-text>
          </template>

          <el-form-item
            :label="t('dataScope.field.type')"
            :prop="`scopes.${index}.scopeType`"
            :rules="[{ required: true, message: t('dataScope.field.type'), trigger: 'change' }]"
          >
            <el-radio-group
              v-model="row.scopeType"
              class="data-scope-form-fields__types"
              @change="onScopeTypeChange(row)"
            >
              <el-radio-button
                v-for="scopeType in dimensionCatalog[row.dimension].scopeTypes"
                :key="scopeType"
                :value="scopeType"
              >
                {{ scopeTypeLabel[scopeType] }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            v-if="
              dimensionCatalog[row.dimension].tree && (row.scopeType === 'IDS' || row.scopeType === 'IDS_AND_CHILD')
            "
            :label="t('dataScope.field.scopeIds')"
            :prop="`scopes.${index}.scopeIds`"
            :rules="[
              {
                validator: (_rule, value, callback) => {
                  if (!value?.length) {
                    callback(new Error(t('dataScope.validation.scopeIdsRequired')));
                    return;
                  }
                  callback();
                },
                trigger: 'change',
              },
            ]"
          >
            <el-tree-select
              v-model="row.scopeIds"
              :data="deptTree"
              :placeholder="t('dataScope.placeholder.scopeIds')"
              check-on-click-node
              check-strictly
              class="w-full"
              clearable
              collapse-tags
              collapse-tags-indicator
              default-expand-all
              filterable
              multiple
              show-checkbox
            />
          </el-form-item>

          <el-form-item
            :label="t('dataScope.field.remark')"
            :prop="`scopes.${index}.remark`"
            :rules="[{ max: 500, message: t('dataScope.validation.remarkMaxLength'), trigger: 'blur' }]"
          >
            <el-input
              v-model="row.remark"
              :placeholder="t('dataScope.field.remark')"
              :rows="3"
              maxlength="500"
              show-word-limit
              type="textarea"
            />
          </el-form-item>

          <el-button class="w-full" plain type="danger" @click="removeDimension(row.dimension)">
            {{ t('dataScope.action.remove') }}
          </el-button>
        </el-collapse-item>
      </el-collapse>
    </el-col>
  </el-row>
</template>
