<script setup lang="ts">
import { DOC_PAGES, DOC_SECTIONS, docPath, type DocSection } from '~/utils/docs'
import { loadDocNav } from '~/utils/docs-render'
import { API_GROUPS, API_TOP_LEVEL, groupEntrySlug, pick, type ApiEndpoint, type ApiGroup } from '~/utils/api-catalog'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()
const links = useSiteLinks()
const { isDark, toggle } = useTheme()
const open = ref(false)
const query = ref('')
const searchEl = ref<HTMLInputElement | null>(null)
const mainEl = ref<HTMLElement | null>(null)
const isMac = ref(false)
const toc = useDocsToc()
const opened = useState<Record<string, boolean>>('docs-api-opened', () => ({}))
const otherLocale = computed(() => (locale.value === 'zh' ? 'en' : 'zh'))
const nav = computed(() => {
  const pages = loadDocNav(locale.value)
  return [
    { slug: '', section: 'start' as DocSection, title: t('docs.hub.nav'), description: t('docs.hub.subtitle') },
    ...pages,
  ]
})

const sectionHome: Record<DocSection, string> = {
  start: '/docs',
  install: '/docs/install',
  guide: '/docs/studio',
  api: '/docs/api',
  ref: '/docs/faq',
}

const activeSection = computed<DocSection>(() => {
  if (isHub()) return 'start'
  return DOC_PAGES.find(p => isActive(p.slug))?.section || 'start'
})

const searching = computed(() => query.value.trim().length > 0)
const groupSlugs = new Set(API_GROUPS.map(g => g.slug))
const endpointSlugs = new Set([...API_TOP_LEVEL, ...API_GROUPS.flatMap(g => g.endpoints)].map(e => e.slug))

const sections = computed(() => {
  const needle = query.value.trim().toLowerCase()
  const ids = searching.value ? DOC_SECTIONS : [activeSection.value]
  return ids.map(id => ({
    id,
    title: t(`docs.sections.${id}`),
    pages: nav.value.filter((p) => {
      if (p.section !== id) return false
      if (id === 'api' && (endpointSlugs.has(p.slug) || groupSlugs.has(p.slug)))
        return false
      if (!needle) return true
      return `${p.title} ${p.description} ${p.slug}`.toLowerCase().includes(needle)
    }),
  })).filter((sec) => {
    if (sec.pages.length) return true
    if (sec.id !== 'api') return false
    return !searching.value || apiSearchHits.value.length > 0
  })
})

const apiSearchHits = computed(() => {
  const needle = query.value.trim().toLowerCase()
  if (!needle) return [] as { kind: 'group' | 'ep'; group?: ApiGroup; ep?: ApiEndpoint }[]
  const hits: { kind: 'group' | 'ep'; group?: ApiGroup; ep?: ApiEndpoint }[] = []
  for (const ep of API_TOP_LEVEL) {
    const hay = `${pick(ep.title, locale.value)} ${ep.path} ${ep.method} ${ep.slug}`.toLowerCase()
    if (hay.includes(needle)) hits.push({ kind: 'ep', ep })
  }
  for (const g of API_GROUPS) {
    const gHay = `${pick(g.title, locale.value)} ${g.slug}`.toLowerCase()
    if (gHay.includes(needle)) hits.push({ kind: 'group', group: g })
    for (const ep of g.endpoints) {
      const hay = `${pick(ep.title, locale.value)} ${ep.path} ${ep.method} ${ep.slug}`.toLowerCase()
      if (hay.includes(needle)) hits.push({ kind: 'ep', ep })
    }
  }
  return hits
})

const currentApiGroupId = computed(() => {
  const path = route.path.replace(/\/$/, '')
  const slug = path.match(/\/docs\/(.+)$/)?.[1] || ''
  return API_GROUPS.find(g => g.slug === slug || g.endpoints.some(e => e.slug === slug))?.id || ''
})

watch(currentApiGroupId, (id, prev) => {
  if (id && id !== prev)
    opened.value = { ...opened.value, [id]: true }
}, { immediate: true })

function isFoldOpen(id: string) {
  return opened.value[id] === true
}

function toggleFold(id: string) {
  opened.value = { ...opened.value, [id]: !isFoldOpen(id) }
}


function isHub() {
  const path = route.path.replace(/\/$/, '')
  return path === localePath('/docs') || path.endsWith('/docs')
}

function isActive(slug: string) {
  const path = route.path.replace(/\/$/, '')
  return path === localePath(docPath(slug)) || path.endsWith(`/docs/${slug}`)
}

function pageTo(p: { slug: string }) {
  return p.slug ? localePath(docPath(p.slug)) : localePath('/docs')
}

function isPageActive(p: { slug: string }) {
  return p.slug ? isActive(p.slug) : isHub()
}

function focusSearch() {
  searchEl.value?.focus()
  searchEl.value?.select()
}

function onSearchKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    query.value = ''
    searchEl.value?.blur()
  }
}

function onKey(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    open.value = true
    nextTick(focusSearch)
  }
}

onMounted(() => {
  isMac.value = /Mac|iPhone|iPad/.test(navigator.platform)
  window.addEventListener('keydown', onKey)
})
onUnmounted(() => window.removeEventListener('keydown', onKey))

watch(() => route.path, () => {
  open.value = false
  nextTick(() => {
    if (mainEl.value)
      mainEl.value.scrollTop = 0
  })
})
</script>

<template>
  <div class="docs-root">
    <aside class="docs-side" :class="open ? 'docs-side--open' : ''">
      <div class="docs-brand">
        <NuxtLink :to="localePath('/')" class="docs-brand-link">
          <SiteLogo class="h-7 w-7" />
          <span>EasyTV</span>
        </NuxtLink>
        <button type="button" class="docs-icon-btn docs-mobile-only" :aria-label="t('nav.docs')" @click="open = false">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
      </div>
      <div class="docs-search-wrap" @click.stop>
        <svg class="docs-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>
        <input
          ref="searchEl"
          v-model="query"
          type="search"
          :placeholder="t('docs.search')"
          class="docs-search"
          @keydown="onSearchKey"
        >
        <kbd class="docs-kbd">{{ isMac ? '⌘ K' : 'Ctrl K' }}</kbd>
      </div>
      <nav class="docs-nav docs-scroll">
        <p v-if="!sections.length && !apiSearchHits.length" class="px-3 py-2 text-sm" style="color: var(--fg-3)">{{ t('docs.empty') }}</p>
        <div v-for="sec in sections" :key="sec.id" class="docs-nav-group">
          <div v-if="searching" class="docs-nav-label">{{ sec.title }}</div>
          <NuxtLink
            v-for="p in sec.pages"
            :key="`${sec.id}-${p.slug}`"
            :to="pageTo(p)"
            class="docs-link"
            :class="{ 'docs-link--active': isPageActive(p) }"
            @click="open = false"
          >{{ p.title }}</NuxtLink>
          <template v-if="sec.id === 'api' && searching">
            <NuxtLink
              v-for="hit in apiSearchHits"
              :key="hit.ep?.slug || hit.group?.slug"
              :to="localePath(docPath(hit.ep?.slug || (hit.group ? groupEntrySlug(hit.group) : 'api')))"
              class="docs-link docs-link--ep"
              :class="{ 'docs-link--active': isActive(hit.ep?.slug || (hit.group ? groupEntrySlug(hit.group) : '')) }"
              @click="open = false"
            >
              <span>{{ hit.ep ? pick(hit.ep.title, locale) : pick(hit.group!.title, locale) }}</span>
              <span v-if="hit.ep" class="docs-method-mini" :class="`is-${hit.ep.method.toLowerCase()}`">{{ hit.ep.method }}</span>
            </NuxtLink>
          </template>
          <template v-if="sec.id === 'api' && !searching">
            <NuxtLink
              v-for="ep in API_TOP_LEVEL"
              :key="ep.slug"
              :to="localePath(docPath(ep.slug))"
              class="docs-link docs-link--ep"
              :class="{ 'docs-link--active': isActive(ep.slug) }"
              @click="open = false"
            >
              <span>{{ pick(ep.title, locale) }}</span>
              <span class="docs-method-mini" :class="`is-${ep.method.toLowerCase()}`">{{ ep.method }}</span>
            </NuxtLink>
            <template v-for="g in API_GROUPS" :key="g.id">
              <NuxtLink
                v-if="!g.endpoints.length"
                :to="localePath(docPath(g.slug))"
                class="docs-link"
                :class="{ 'docs-link--active': isActive(g.slug) }"
                @click="open = false"
              >{{ pick(g.title, locale) }}</NuxtLink>
              <div v-else class="docs-fold" :class="{ 'is-open': isFoldOpen(g.id) }">
                <button
                  type="button"
                  class="docs-fold-row"
                  :aria-expanded="isFoldOpen(g.id)"
                  @click="toggleFold(g.id)"
                >
                  <span class="docs-fold-title">{{ pick(g.title, locale) }}</span>
                  <span class="docs-fold-chevron" aria-hidden="true">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5 11 8l-5 4.5" /></svg>
                  </span>
                </button>
                <div v-if="isFoldOpen(g.id)" class="docs-fold-items">
                  <NuxtLink
                    v-for="ep in g.endpoints"
                    :key="ep.slug"
                    :to="localePath(docPath(ep.slug))"
                    class="docs-link docs-link--ep"
                    :class="{ 'docs-link--active': isActive(ep.slug) }"
                    @click="open = false"
                  >
                    <span>{{ pick(ep.title, locale) }}</span>
                    <span class="docs-method-mini" :class="`is-${ep.method.toLowerCase()}`">{{ ep.method }}</span>
                  </NuxtLink>
                </div>
              </div>
            </template>
          </template>
        </div>
      </nav>
      <div class="docs-side-foot">
        <a :href="links.org" target="_blank" rel="noopener" class="docs-icon-btn" :aria-label="t('nav.github')">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5Z" /></svg>
        </a>
        <button type="button" class="docs-icon-btn" :aria-label="t('nav.theme')" @click="toggle">
          <svg v-if="isDark" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" /></svg>
          <svg v-else class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>
        </button>
      </div>
    </aside>

    <div class="docs-col">
      <header class="docs-top">
        <div class="flex min-w-0 items-center gap-1">
          <button type="button" class="docs-icon-btn docs-mobile-only" aria-label="menu" @click="open = true">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
          <nav class="docs-tabs">
            <NuxtLink
              v-for="id in DOC_SECTIONS"
              :key="id"
              :to="localePath(sectionHome[id])"
              class="docs-tab"
              :class="{ 'docs-tab--active': activeSection === id }"
            >{{ t(`docs.sections.${id}`) }}</NuxtLink>
          </nav>
        </div>
        <div class="flex shrink-0 items-center gap-1">
          <NuxtLink :to="switchLocalePath(otherLocale)" class="docs-tab hidden sm:inline-flex">{{ t('nav.lang') }}</NuxtLink>
          <a :href="links.org" target="_blank" rel="noopener" class="docs-tab hidden sm:inline-flex">{{ t('nav.github') }}</a>
        </div>
      </header>

      <div class="docs-stage">
        <div ref="mainEl" class="docs-main docs-scroll">
          <slot />
        </div>
        <aside v-if="toc.length" class="docs-toc docs-scroll">
          <div class="docs-toc-title">
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h10M4 17h16" /></svg>
            {{ t('docs.toc') }}
          </div>
          <a
            v-for="h in toc"
            :key="h.id"
            :href="`#${h.id}`"
            :class="{ 'is-h3': h.depth === 3 }"
          >{{ h.text }}</a>
        </aside>
      </div>
    </div>

    <div v-if="open" class="docs-mask docs-mobile-only" @click="open = false" />
  </div>
</template>
