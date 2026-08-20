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
  <div class="flex flex-col md:flex-row justify-center items-center min-h-full w-full p-4 md:p-0">
    <noAccess />
    <div class="mt-8 md:ml-12 md:mt-0 text-center md:text-left">
      <p
        v-motion
        :enter="{ opacity: 1, y: 0, transition: { delay: 80 } }"
        :initial="{ opacity: 0, y: 100 }"
        class="font-medium text-4xl mb-4! dark:text-white"
      >
        403
      </p>
      <p
        v-motion
        :enter="{ opacity: 1, y: 0, transition: { delay: 120 } }"
        :initial="{ opacity: 0, y: 100 }"
        class="text-xl mb-4! text-gray-500"
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
