<script lang="ts" setup>
import { THEME_LAB_PALETTE_ROWS } from '../constants/theme-lab-palettes';
import ThemeLabSection from './ThemeLabSection.vue';

defineOptions({
  name: 'ColorPaletteSection',
});
</script>

<template>
  <ThemeLabSection
    hint="直接读 --auth-color-*；色板对、组件不对 → map-element；色板不对 → color.scss"
    title="Token 色板"
  >
    <div v-for="row in THEME_LAB_PALETTE_ROWS" :key="row.tokenPrefix" class="color-palette-section__row">
      <span class="color-palette-section__label">{{ row.label }}</span>
      <div class="color-palette-section__swatches">
        <div
          v-for="step in row.steps"
          :key="`${row.tokenPrefix}-${step}`"
          :style="{ background: `var(--auth-color-${row.tokenPrefix}-${step})` }"
          :title="`--auth-color-${row.tokenPrefix}-${step}`"
          class="color-palette-section__swatch"
        >
          <span class="color-palette-section__step">{{ step }}</span>
        </div>
      </div>
    </div>
  </ThemeLabSection>
</template>

<style lang="scss" scoped>
.color-palette-section {
  &__row {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  &__label {
    flex: 0 0 64px;
    font-size: var(--auth-font-size-small);
    color: var(--auth-text-secondary);
  }

  &__swatches {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    gap: 4px;
  }

  &__swatch {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 1px solid var(--auth-color-border);
    border-radius: 4px;
  }

  &__step {
    padding: 0 2px;
    font-size: 10px;
    line-height: 1.4;
    color: var(--auth-text-anti);
    text-shadow: 0 0 2px rgb(0 0 0 / 45%);
  }
}
</style>
