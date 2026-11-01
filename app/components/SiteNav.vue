<script setup lang="ts">
const { t, locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const links = useSiteLinks()
const { isDark, toggle } = useTheme()
const open = ref(false)
const items = [
  { id: 'features', key: 'nav.features' },
  { id: 'why', key: 'nav.why' },
  { id: 'arch', key: 'nav.arch' },
  { id: 'compare', key: 'nav.compare' },
  { id: 'quickstart', key: 'nav.quickstart' },
  { id: 'roadmap', key: 'nav.roadmap' },
]
const otherLocale = computed(() => (locale.value === 'zh' ? 'en' : 'zh'))
</script>

<template>
  <header class="sticky top-0 z-40 border-b backdrop-blur-md" style="border-color: var(--line-2); background: color-mix(in srgb, var(--bg) 78%, transparent)">
    <div class="container-x flex h-16 items-center justify-between gap-3">
      <a href="#top" class="flex items-center gap-2.5">
        <SiteLogo class="h-7 w-7" />
        <span class="text-[15px] font-semibold tracking-tight">EasyTV</span>
        <span class="hidden rounded-full border px-2 py-0.5 text-[11px] font-medium sm:inline" style="border-color: var(--line); color: var(--fg-3)">open source</span>
      </a>

      <nav class="hidden items-center gap-1 lg:flex">
        <a v-for="it in items" :key="it.id" :href="`#${it.id}`" class="rounded-full px-3 py-1.5 text-sm transition hover:bg-[var(--panel-2)]" style="color: var(--fg-2)">{{ t(it.key) }}</a>
      </nav>

      <div class="flex items-center gap-2">
        <NuxtLink :to="switchLocalePath(otherLocale)" class="hidden rounded-full px-3 py-1.5 text-sm transition hover:bg-[var(--panel-2)] sm:inline-flex" style="color: var(--fg-2)">{{ t('nav.lang') }}</NuxtLink>
        <button type="button" :aria-label="t('nav.theme')" class="rounded-full p-2 transition hover:bg-[var(--panel-2)]" style="color: var(--fg-2)" @click="toggle">
          <svg v-if="isDark" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4"/></svg>
          <svg v-else class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
        </button>
        <a :href="links.org" target="_blank" rel="noopener" class="btn btn-primary hidden !px-4 !py-2 sm:inline-flex">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5Z"/></svg>
          {{ t('nav.github') }}
        </a>
        <button type="button" class="rounded-full p-2 lg:hidden" style="color: var(--fg-2)" aria-label="menu" @click="open = !open">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        </button>
      </div>
    </div>
    <div v-if="open" class="border-t lg:hidden" style="border-color: var(--line-2); background: var(--bg)">
      <div class="container-x flex flex-col py-2">
        <a v-for="it in items" :key="it.id" :href="`#${it.id}`" class="py-2.5 text-sm" style="color: var(--fg-2)" @click="open = false">{{ t(it.key) }}</a>
        <NuxtLink :to="switchLocalePath(otherLocale)" class="py-2.5 text-sm" style="color: var(--fg-2)" @click="open = false">{{ t('nav.lang') }}</NuxtLink>
        <a :href="links.org" target="_blank" rel="noopener" class="py-2.5 text-sm font-semibold">{{ t('nav.github') }}</a>
      </div>
    </div>
  </header>
</template>
