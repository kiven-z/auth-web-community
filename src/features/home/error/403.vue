<script lang="ts" setup>
import noAccess from '@/assets/status/403.svg?component';
import ErrorPageActions from '@/features/home/error/components/ErrorPageActions.vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'ForbiddenPage',
});

const { t } = useI18n();
</script>

<template>
  <div class="flex min-h-full w-full flex-col items-center justify-center p-4 md:flex-row md:p-0">
    <noAccess />
    <div class="mt-8 text-center md:mt-0 md:ml-12 md:text-left">
      <p
        v-motion
        :enter="{ opacity: 1, y: 0, transition: { delay: 80 } }"
        :initial="{ opacity: 0, y: 100 }"
        class="mb-4! text-4xl font-medium dark:text-white"
      >
        403
      </p>
      <p
        v-motion
        :enter="{ opacity: 1, y: 0, transition: { delay: 120 } }"
        :initial="{ opacity: 0, y: 100 }"
        class="mb-4! text-xl text-gray-500"
      >
        {{ t('errorPage.forbidden') }}
      </p>
      <ErrorPageActions />
    </div>
  </div>
</template>

<style scoped>
.main-content {
  margin: 0 !important;
}
</style>
