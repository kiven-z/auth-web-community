<script lang="ts" setup>
import { MESSAGE_TEMPLATE_PERMS } from '@/features/message/_shared/constants/permissions';
import {
  useRequireFieldsEditor,
  type UseRequireFieldsEditorOptions,
} from '@/features/message/_shared/hooks/use-require-fields-editor';
import type { RequireFieldEditRow } from '@/features/message/_shared/utils/require-fields-codec';
import { useEditorTheme } from '@/shared/composables/editor/use-editor-theme';
import { CodeEditor } from 'monaco-editor-vue3';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'MessageTemplateRequireFieldsDialog',
});

const props = defineProps<UseRequireFieldsEditorOptions>();

const { t } = useI18n();
const { monacoTheme } = useEditorTheme();
const { loading, activeTab, editRows, jsonText, beforeLeave, onAdd, onDel, submit } = useRequireFieldsEditor({
  id: props.id,
  channel: props.channel,
});

defineExpose({ submit });
</script>

<template>
  <div v-loading="loading" class="require-fields-dialog-inner">
    <el-tabs v-model="activeTab" :before-leave="beforeLeave">
      <el-tab-pane :label="t('messageTemplate.tableTab')" name="table">
        <el-table
          :data="editRows"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)',
          }"
          :row-key="(row: RequireFieldEditRow) => String(row.uid)"
          border
          class="w-full"
        >
          <el-table-column :label="t('messageTemplate.fieldKey')" min-width="140">
            <template #default="{ row }">
              <el-input v-model="row.key" :placeholder="t('messageTemplate.placeholder.fieldKey')" clearable />
            </template>
          </el-table-column>

          <el-table-column :label="t('messageTemplate.fieldDescription')" min-width="140">
            <template #default="{ row }">
              <el-input
                v-model="row.description"
                :placeholder="t('messageTemplate.placeholder.fieldDescription')"
                clearable
              />
            </template>
          </el-table-column>

          <el-table-column :label="t('messageTemplate.fieldExampleValue')" min-width="200">
            <template #default="{ row }">
              <el-input
                v-model="row.exampleValue"
                :autosize="{ minRows: 1, maxRows: 4 }"
                :placeholder="t('messageTemplate.placeholder.fieldExampleValue')"
                type="textarea"
              />
            </template>
          </el-table-column>

          <el-table-column :label="t('table.actions')" align="center" fixed="right" width="100">
            <template #default="{ row }">
              <el-button v-auth="MESSAGE_TEMPLATE_PERMS.UPDATE" link type="danger" @click="onDel(row)">
                {{ t('buttons.actionDelete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-button v-auth="MESSAGE_TEMPLATE_PERMS.UPDATE" class="w-full mt-2!" plain type="primary" @click="onAdd">
          {{ t('buttons.actionAdd') }}
        </el-button>
      </el-tab-pane>

      <el-tab-pane :label="t('messageTemplate.jsonTab')" lazy name="json">
        <CodeEditor
          v-if="activeTab === 'json'"
          v-model:value="jsonText"
          :theme="monacoTheme"
          class="w-full border"
          height="450px"
          language="json"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.require-fields-dialog-inner {
  min-height: 240px;
}
</style>
