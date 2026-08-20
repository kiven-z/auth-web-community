<script lang="ts" setup>
import ThemeLabSection from './ThemeLabSection.vue';

defineOptions({
  name: 'SemanticSurfacesSection',
});

const alertTypes = ['primary', 'success', 'warning', 'error', 'info'] as const;
const tagTypes = ['primary', 'success', 'warning', 'danger', 'info'] as const;
</script>

<template>
  <ThemeLabSection hint="Alert / Tag 吃 *-light-9；暗色下 info 浅底勿再发亮灰块" title="语义浅底">
    <div class="semantic-surfaces-section__alerts">
      <el-alert
        v-for="type in alertTypes"
        :key="type"
        :closable="false"
        :title="`Alert ${type}`"
        :type="type"
        show-icon
      />
    </div>

    <div class="semantic-surfaces-section__tags">
      <el-tag v-for="type in tagTypes" :key="`solid-${type}`" :type="type">
        {{ type }}
      </el-tag>
      <el-tag v-for="type in tagTypes" :key="`light-${type}`" :type="type" effect="light">light {{ type }}</el-tag>
      <el-tag v-for="type in tagTypes" :key="`plain-${type}`" :type="type" effect="plain">plain {{ type }}</el-tag>
    </div>
  </ThemeLabSection>
</template>

<style lang="scss" scoped>
.semantic-surfaces-section {
  &__alerts {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>
