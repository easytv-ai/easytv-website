<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const links = useSiteLinks()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t py-10" style="border-color: var(--line-2)">
    <div class="container-x flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3">
        <SiteLogo class="h-7 w-7" />
        <div>
          <div class="text-sm font-semibold">EasyTV</div>
          <div class="text-xs" style="color: var(--fg-3)">{{ t('footer.tagline') }}</div>
        </div>
      </div>
      <nav class="flex flex-wrap gap-x-5 gap-y-2 text-sm" style="color: var(--fg-2)">
        <NuxtLink :to="localePath('/docs')">{{ t('footer.links.docs') }}</NuxtLink>
        <a :href="links.web" target="_blank" rel="noopener">{{ t('footer.links.web') }}</a>
        <a :href="links.api" target="_blank" rel="noopener">{{ t('footer.links.api') }}</a>
        <a :href="links.manage" target="_blank" rel="noopener">{{ t('footer.links.manage') }}</a>
        <a :href="links.partner" target="_blank" rel="noopener">{{ t('footer.links.partner') }}</a>
        <a :href="links.demo" target="_blank" rel="noopener">{{ t('footer.links.demo') }}</a>
      </nav>
      <div class="text-xs" style="color: var(--fg-3)">© {{ year }} EasyTV · {{ t('footer.license') }}</div>
    </div>
  </footer>
</template>
