<script lang="ts" setup>
import { ref } from 'vue';
import ThemeLabSection from './ThemeLabSection.vue';

defineOptions({
  name: 'FormFillSection',
});

const inputValue = ref('');
const selectValue = ref('');
const switchValue = ref(true);
const radioValue = ref('a');
const checkboxValue = ref(['选项 A']);

const selectOptions = [
  { label: '选项 A', value: 'a' },
  { label: '选项 B', value: 'b' },
  { label: '选项 C', value: 'c' },
];
</script>

<template>
  <ThemeLabSection hint="验 fill / border / text / disabled；focus 描边应跟主色" title="表单填充">
    <div class="form-fill-section__grid">
      <el-input v-model="inputValue" clearable placeholder="普通输入" />
      <el-input disabled model-value="禁用输入" />
      <el-select v-model="selectValue" clearable placeholder="请选择" style="width: 100%">
        <el-option v-for="option in selectOptions" :key="option.value" :label="option.label" :value="option.value" />
      </el-select>
      <el-select disabled model-value="a" style="width: 100%">
        <el-option label="禁用选择" value="a" />
      </el-select>
    </div>

    <div class="form-fill-section__inline">
      <el-switch v-model="switchValue" />
      <el-switch :model-value="false" disabled />
      <el-radio-group v-model="radioValue">
        <el-radio value="a">选项 A</el-radio>
        <el-radio value="b">选项 B</el-radio>
        <el-radio disabled value="c">禁用</el-radio>
      </el-radio-group>
      <el-checkbox-group v-model="checkboxValue">
        <el-checkbox label="选项 A" value="选项 A" />
        <el-checkbox label="选项 B" value="选项 B" />
        <el-checkbox disabled label="禁用" value="禁用" />
      </el-checkbox-group>
    </div>
  </ThemeLabSection>
</template>

<style lang="scss" scoped>
.form-fill-section {
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
  }

  &__inline {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
  }
}
</style>
