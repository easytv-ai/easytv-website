<script setup lang="ts">
const { t } = useI18n()
const vote = ref<'' | 'up' | 'down'>('')
</script>

<template>
  <div class="docs-feedback">
    <div class="docs-feedback-row">
    <p>{{ vote ? t('docs.thanks') : t('docs.feedback') }}</p>
    <div v-if="!vote" class="docs-feedback-actions">
      <button type="button" class="docs-pill" @click="vote = 'up'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3Zm0 0 4.2-6.3A2 2 0 0 1 14.8 5H15a2 2 0 0 1 2 2v4h3.2a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 19 21H7" /></svg>
        {{ t('docs.helpful') }}
      </button>
      <button type="button" class="docs-pill" @click="vote = 'down'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 13V4h3a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-3Zm0 0-4.2 6.3A2 2 0 0 1 9.2 19H9a2 2 0 0 1-2-2v-4H3.8a2 2 0 0 1-2-2.3l1.2-6A2 2 0 0 1 5 3h12" /></svg>
        {{ t('docs.unhelpful') }}
      </button>
    </div>
    </div>
  </div>
</template>
