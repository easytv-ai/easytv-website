<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
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
</script>

<template>
  <header class="sticky top-0 z-40 border-b backdrop-blur-md" style="border-color: var(--line-2); background: color-mix(in srgb, var(--bg) 78%, transparent)">
    <div class="container-x flex h-16 items-center justify-between gap-3">
      <a href="#top" class="flex shrink-0 items-center gap-2.5">
        <SiteLogo class="h-7 w-7" />
        <span class="text-[15px] font-semibold tracking-tight">EasyTV</span>
        <span class="hidden whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium sm:inline xl:hidden" style="border-color: var(--line); color: var(--fg-3)">open source</span>
      </a>

      <nav class="hidden items-center gap-1 xl:flex">
        <a v-for="it in items" :key="it.id" :href="`#${it.id}`" class="nav-link">{{ t(it.key) }}</a>
        <NuxtLink :to="localePath('/docs')" class="nav-link">{{ t('nav.docs') }}</NuxtLink>
      </nav>

      <div class="flex shrink-0 items-center gap-1 sm:gap-1.5">
        <LangSwitch compact />
        <button type="button" :aria-label="t('nav.theme')" class="nav-icon-btn" @click="toggle">
          <svg v-if="isDark" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4"/></svg>
          <svg v-else class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
        </button>
        <a :href="links.org" target="_blank" rel="noopener" class="btn btn-primary !h-10 !px-3.5 !py-0 sm:ml-1 sm:!px-4">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5Z"/></svg>
          {{ t('nav.github') }}
        </a>
        <button type="button" class="nav-icon-btn nav-menu-btn" :aria-label="t('nav.menu')" :aria-expanded="open" @click="open = !open">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        </button>
      </div>
    </div>
    <div v-if="open" class="border-t xl:hidden" style="border-color: var(--line-2); background: var(--bg)">
      <div class="container-x flex flex-col py-2">
        <a v-for="it in items" :key="it.id" :href="`#${it.id}`" class="-mx-2 rounded-lg px-2 py-3 text-[15px] transition-colors hover:bg-[var(--panel-2)]" style="color: var(--fg-2)" @click="open = false">{{ t(it.key) }}</a>
        <NuxtLink :to="localePath('/docs')" class="-mx-2 rounded-lg px-2 py-3 text-[15px] transition-colors hover:bg-[var(--panel-2)]" style="color: var(--fg-2)" @click="open = false">{{ t('nav.docs') }}</NuxtLink>
        <a :href="links.org" target="_blank" rel="noopener" class="-mx-2 rounded-lg px-2 py-3 text-[15px] font-semibold transition-colors hover:bg-[var(--panel-2)]">{{ t('nav.github') }}</a>
      </div>
    </div>
  </header>
</template>
