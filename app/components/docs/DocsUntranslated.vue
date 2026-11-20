<script setup lang="ts">
// 当前语种还没有这页的译文、正文退回到简体或英文时的提示条
const { t } = useI18n()
</script>

<template>
  <p class="docs-untranslated">
    <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>
    <span>{{ t('docs.untranslated') }}</span>
    <a href="https://github.com/easytv-ai/easytv-website/tree/main/content/docs" target="_blank" rel="noopener">{{ t('docs.untranslated_cta') }} ↗</a>
  </p>
</template>
