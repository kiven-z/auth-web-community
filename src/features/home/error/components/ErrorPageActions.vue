<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'ErrorPageActions',
});

const { t } = useI18n();
const router = useRouter();
</script>

<template>
  <div class="error-page-actions">
    <el-button
      v-motion
      :enter="{ opacity: 1, y: 0, transition: { delay: 160 } }"
      :initial="{ opacity: 0, y: 100 }"
      type="primary"
      @click="router.back()"
    >
      {{ t('errorPage.back') }}
    </el-button>

    <el-button
      v-motion
      :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }"
      :initial="{ opacity: 0, y: 100 }"
      @click="router.push({ name: 'Welcome' })"
    >
      {{ t('errorPage.backHome') }}
    </el-button>
  </div>
</template>

<style scoped>
.error-page-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

@media (width >= 768px) {
  .error-page-actions {
    justify-content: flex-start;
  }
}
</style>
