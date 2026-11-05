<script setup lang="ts">
import { DOC_SECTIONS, docPath } from '~/utils/docs'
import { loadDocNav } from '~/utils/docs-render'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()
const links = useSiteLinks()
const { isDark, toggle } = useTheme()
const open = ref(false)
const query = ref('')
const otherLocale = computed(() => (locale.value === 'zh' ? 'en' : 'zh'))
const nav = computed(() => loadDocNav(locale.value))
const sections = computed(() => {
  const needle = query.value.trim().toLowerCase()
  return DOC_SECTIONS.map(id => ({
    id,
    title: t(`docs.sections.${id}`),
    pages: nav.value.filter((p) => {
      if (p.section !== id) return false
      if (!needle) return true
      return `${p.title} ${p.description} ${p.slug}`.toLowerCase().includes(needle)
    }),
  })).filter(sec => sec.pages.length)
})

function isActive(slug: string) {
  const path = route.path.replace(/\/$/, '')
  return path === localePath(docPath(slug)) || path.endsWith(`/docs/${slug}`)
}
</script>

<template>
  <div class="docs-root" style="background: var(--bg); color: var(--fg)">
    <header class="z-40 shrink-0 border-b backdrop-blur-md" style="border-color: var(--line-2); background: color-mix(in srgb, var(--bg) 78%, transparent)">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <div class="flex items-center gap-3">
          <button type="button" class="rounded-full p-2 lg:hidden" style="color: var(--fg-2)" aria-label="menu" @click="open = !open">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
          <NuxtLink :to="localePath('/')" class="flex items-center gap-2.5">
            <SiteLogo class="h-7 w-7" />
            <span class="text-[15px] font-semibold tracking-tight">EasyTV</span>
          </NuxtLink>
          <NuxtLink :to="localePath('/docs')" class="hidden rounded-full px-2.5 py-0.5 text-[13px] font-medium sm:inline" style="background: var(--panel-2); color: var(--fg-2)">{{ t('nav.docs') }}</NuxtLink>
        </div>
        <div class="flex items-center gap-2">
          <NuxtLink :to="switchLocalePath(otherLocale)" class="hidden rounded-full px-3 py-1.5 text-sm sm:inline-flex" style="color: var(--fg-2)">{{ t('nav.lang') }}</NuxtLink>
          <button type="button" :aria-label="t('nav.theme')" class="rounded-full p-2" style="color: var(--fg-2)" @click="toggle">
            <svg v-if="isDark" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" /></svg>
            <svg v-else class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>
          </button>
          <a :href="links.org" target="_blank" rel="noopener" class="btn btn-primary hidden !px-4 !py-2 sm:inline-flex">{{ t('nav.github') }}</a>
        </div>
      </div>
    </header>

    <div class="docs-layout">
      <aside class="docs-side docs-scroll" :class="open ? 'docs-side--open' : ''">
        <nav class="docs-nav" @click="open = false">
          <label class="mb-5 block px-2" @click.stop>
            <span class="sr-only">{{ t('docs.search') }}</span>
            <input
              v-model="query"
              type="search"
              :placeholder="t('docs.search')"
              class="docs-search"
            >
          </label>
          <p v-if="!sections.length" class="px-2 text-sm" style="color: var(--fg-3)">{{ t('docs.empty') }}</p>
          <div v-for="sec in sections" :key="sec.id" class="mb-6">
            <div class="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider" style="color: var(--fg-3)">{{ sec.title }}</div>
            <NuxtLink
              v-for="p in sec.pages"
              :key="p.slug"
              :to="localePath(docPath(p.slug))"
              class="block rounded-lg px-2 py-1.5 text-sm transition"
              :style="{ color: isActive(p.slug) ? 'var(--fg)' : 'var(--fg-2)', background: isActive(p.slug) ? 'var(--panel-2)' : 'transparent' }"
            >{{ p.title }}</NuxtLink>
          </div>
        </nav>
      </aside>
      <div class="docs-main docs-scroll">
        <slot />
      </div>
    </div>
    <div v-if="open" class="fixed inset-0 z-20 bg-black/40 lg:hidden" @click="open = false" />
  </div>
</template>
