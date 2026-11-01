<script setup lang="ts">
const { t } = useI18n()
useSeoMeta({
  title: t('meta.title'),
  description: t('meta.description'),
  ogTitle: t('meta.title'),
  ogDescription: t('meta.description'),
})
</script>

<template>
  <div>
    <SiteNav />
    <main>
      <SiteHero />
      <SiteShowcase />
      <SiteFeatures />
      <SiteWhy />
      <SiteArchitecture />
      <SiteCompare />
      <SiteQuickstart />
      <SiteRoadmap />
      <SiteCommunity />
    </main>
    <SiteFooter />
  </div>
</template>
