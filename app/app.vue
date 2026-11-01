<script setup lang="ts">
const { locale, locales } = useI18n()
const head = useLocaleHead({ dir: true, seo: true })
const config = useRuntimeConfig()

useHead({
  htmlAttrs: { lang: computed(() => head.value.htmlAttrs?.lang ?? locale.value) },
  link: computed(() => head.value.link ?? []),
  meta: computed(() => head.value.meta ?? []),
})
useSeoMeta({
  ogSiteName: 'EasyTV',
  ogType: 'website',
  ogImage: `${config.public.siteUrl}/og-image.png`,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="min-h-screen bg-[var(--bg)] text-[var(--fg)] antialiased">
    <NuxtPage />
  </div>
</template>
