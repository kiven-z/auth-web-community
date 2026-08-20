<script lang="ts" setup>
import ButtonStatesSection from '../components/ButtonStatesSection.vue';
import ColorPaletteSection from '../components/ColorPaletteSection.vue';
import FormFillSection from '../components/FormFillSection.vue';
import LoadingMaskSection from '../components/LoadingMaskSection.vue';
import OverlaySection from '../components/OverlaySection.vue';
import SemanticSurfacesSection from '../components/SemanticSurfacesSection.vue';
import TableHighlightSection from '../components/TableHighlightSection.vue';
import ThemeLabToolbar from '../components/ThemeLabToolbar.vue';

defineOptions({
  name: 'WelcomeThemeLabTab',
});
</script>

<template>
  <div class="theme-lab-tab">
    <p class="theme-lab-tab__desc">
      验 token → map-element → EP 组件。亮/暗 + 换主色三刀扫；壳层（侧栏/标签页）请用设置面板。
    </p>

    <ThemeLabToolbar />

    <div class="theme-lab-tab__sections">
      <ColorPaletteSection />
      <ButtonStatesSection />
      <SemanticSurfacesSection />
      <FormFillSection />
      <TableHighlightSection />
      <LoadingMaskSection />
      <OverlaySection />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.theme-lab-tab {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__desc {
    margin: 0;
    font-size: var(--auth-font-size-small);
    color: var(--auth-text-placeholder);
  }

  &__sections {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}
</style>
