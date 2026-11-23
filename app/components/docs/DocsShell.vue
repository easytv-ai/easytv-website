<script setup lang="ts">
import { DOC_NAV_GROUPS, DOC_PAGES, DOC_SECTIONS, docPath, type DocSection } from '~/utils/docs'
import { loadDocNav } from '~/utils/docs-render'
import { API_GROUPS, API_TOP_LEVEL, pick, type ApiEndpoint } from '~/utils/api-catalog'
import DocsFooter from '~/components/docs/DocsFooter.vue'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const links = useSiteLinks()
const { isDark, toggle } = useTheme()
const open = ref(false)
const sideCollapsed = ref(false)
const searchOpen = ref(false)
const query = ref('')
const searchEl = ref<HTMLInputElement | null>(null)
const activeHit = ref(0)
const isMac = ref(false)
const toc = useDocsToc()
// 目录由页面在异步 setup 之后写入，SSR 时外壳先渲染、拿不到；挂载后再显示，避免 hydration 不一致。
const tocReady = ref(false)
const activeIds = ref<string[]>([])
const tocListEl = ref<HTMLElement | null>(null)
const thumb = ref({ top: 0, height: 0 })
const track = ref({ width: 0, height: 0, mask: '' })
const opened = useState<Record<string, boolean>>('docs-api-opened', () => ({}))
let tocResize: ResizeObserver | null = null
let mainObserver: MutationObserver | null = null

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

const groupSlugs = new Set(API_GROUPS.map(g => g.slug))
const endpointSlugs = new Set([...API_TOP_LEVEL, ...API_GROUPS.flatMap(g => g.endpoints)].map(e => e.slug))

const sideGroups = computed(() => {
  const pages = nav.value.filter(p => p.section === activeSection.value)
  const used = new Set<string>()
  const groups = DOC_NAV_GROUPS.filter(g => g.section === activeSection.value).map((group) => {
    const list = group.slugs.flatMap((slug) => {
      const page = pages.find(p => p.slug === slug)
      if (!page) return []
      used.add(slug)
      return [page]
    })
    return { id: group.id, pages: list }
  }).filter(group => group.pages.length)
  const rest = pages.filter(p => !used.has(p.slug))
  if (rest.length) groups.push({ id: 'rest', pages: rest })
  return groups
})

const sections = computed(() => {
  return [{
    id: activeSection.value,
    title: t(`docs.sections.${activeSection.value}`),
    pages: nav.value.filter((p) => {
      if (p.section !== activeSection.value) return false
      if (activeSection.value === 'api' && (endpointSlugs.has(p.slug) || groupSlugs.has(p.slug)))
        return false
      return true
    }),
  }]
})

const apiSearchHits = computed(() => {
  const needle = query.value.trim().toLowerCase()
  if (!needle) return [] as ApiEndpoint[]
  const hits: ApiEndpoint[] = []
  const seen = new Set<string>()
  function add(ep: ApiEndpoint) {
    if (seen.has(ep.slug)) return
    seen.add(ep.slug)
    hits.push(ep)
  }
  for (const ep of API_TOP_LEVEL) {
    const hay = `${pick(ep.title, locale.value)} ${ep.path} ${ep.method} ${ep.slug}`.toLowerCase()
    if (hay.includes(needle)) add(ep)
  }
  for (const g of API_GROUPS) {
    const groupMatch = `${pick(g.title, locale.value)} ${g.slug}`.toLowerCase().includes(needle)
    for (const ep of g.endpoints) {
      const hay = `${pick(ep.title, locale.value)} ${ep.path} ${ep.method} ${ep.slug}`.toLowerCase()
      if (groupMatch || hay.includes(needle)) add(ep)
    }
  }
  return hits
})

interface SearchHit {
  slug: string
  title: string
  section: string
}

const searchHits = computed<SearchHit[]>(() => {
  const needle = query.value.trim().toLowerCase()
  if (!needle) return []
  const hits: SearchHit[] = []
  const seen = new Set<string>()
  for (const p of nav.value) {
    const hay = `${p.title} ${p.description} ${p.slug}`.toLowerCase()
    if (!hay.includes(needle) || seen.has(p.slug)) continue
    seen.add(p.slug)
    hits.push({ slug: p.slug, title: p.title, section: t(`docs.sections.${p.section}`) })
  }
  for (const ep of apiSearchHits.value) {
    if (seen.has(ep.slug)) continue
    seen.add(ep.slug)
    hits.push({ slug: ep.slug, title: pick(ep.title, locale.value), section: t('docs.sections.api') })
  }
  return hits.slice(0, 20)
})

watch(searchHits, () => {
  activeHit.value = 0
})

const currentApiGroupId = computed(() => {
  const path = route.path.replace(/\/$/, '')
  const slug = path.match(/\/docs\/(.+)$/)?.[1] || ''
  return API_GROUPS.find(g => g.slug === slug || g.endpoints.some(e => e.slug === slug))?.id || ''
})

function isOpsGroup(id: string) {
  return id === 'admin' || id.startsWith('admin-') || id === 'partner'
}

const apiCategories = computed(() => [
  {
    id: 'studio',
    title: t('docs.api.cat_studio'),
    groups: API_GROUPS.filter(g => !g.parent && !isOpsGroup(g.id)),
  },
  {
    id: 'ops',
    title: t('docs.api.cat_ops'),
    groups: API_GROUPS.filter(g => !g.parent && isOpsGroup(g.id)),
  },
])

function childGroups(id: string) {
  return API_GROUPS.filter(g => g.parent === id)
}

function foldLabel(g: { title: typeof API_GROUPS[number]['title'], navTitle?: typeof API_GROUPS[number]['navTitle'] }) {
  return pick(g.navTitle || g.title, locale.value)
}

watch(currentApiGroupId, (id) => {
  const slug = route.path.replace(/\/$/, '').match(/\/docs\/(.+)$/)?.[1] || ''
  if (API_TOP_LEVEL.some(e => e.slug === slug)) {
    opened.value = { ...opened.value, studio: true }
    return
  }
  if (!id) return
  const parent = API_GROUPS.find(g => g.id === id)?.parent
  const cat = isOpsGroup(id) || (parent ? isOpsGroup(parent) : false) ? 'ops' : 'studio'
  opened.value = { ...opened.value, [cat]: true, [id]: true, ...(parent ? { [parent]: true } : {}) }
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

function openSearch() {
  searchOpen.value = true
  query.value = ''
  nextTick(() => {
    searchEl.value?.focus()
  })
}

function closeSearch() {
  searchOpen.value = false
  query.value = ''
}

function goHit(hit: SearchHit) {
  closeSearch()
  open.value = false
  navigateTo(hit.slug ? localePath(docPath(hit.slug)) : localePath('/docs'))
}

function onSearchKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    closeSearch()
    return
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeHit.value = Math.min(activeHit.value + 1, Math.max(searchHits.value.length - 1, 0))
  }
  else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeHit.value = Math.max(activeHit.value - 1, 0)
  }
  else if (e.key === 'Enter') {
    const hit = searchHits.value[activeHit.value]
    if (hit) {
      e.preventDefault()
      goHit(hit)
    }
  }
}

function onKey(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    if (searchOpen.value) closeSearch()
    else openSearch()
  }
  else if (e.key === 'Escape' && searchOpen.value) {
    closeSearch()
  }
}

function onCopyClick(e: MouseEvent) {
  const btn = (e.target as HTMLElement | null)?.closest('.docs-pre-copy')
  if (!btn) return
  const text = btn.parentElement?.querySelector('code')?.textContent || ''
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    btn.classList.add('is-copied')
    window.setTimeout(() => btn.classList.remove('is-copied'), 1500)
  }).catch(() => {})
}

function syncActive() {
  if (!import.meta.client) return
  const nodes = toc.value
    .map(item => document.getElementById(item.id))
    .filter((node): node is HTMLElement => !!node)
  // 点进页面时正文会晚一拍挂上。这时还没有标题，不能把高亮清掉。
  if (!nodes.length) return
  // 从已经滚过的那一节，连到视野里还能看到的最后一节。粉色竖线把这几节串起来。
  const line = 88
  const limit = window.innerHeight
  let current = 0
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (node && node.getBoundingClientRect().top <= line) current = i
  }
  let end = current
  for (let i = current; i < nodes.length; i++) {
    const node = nodes[i]
    if (node && node.getBoundingClientRect().top <= limit) end = i
    else break
  }
  activeIds.value = nodes.slice(current, end + 1).map(node => node.id)
}

function onScroll() {
  syncActive()
}

function isTocActive(id: string) {
  return activeIds.value.includes(id)
}

function lineOffset(depth: number) {
  return depth >= 3 ? 10 : 0
}

function itemOffset(depth: number) {
  if (depth <= 2) return 14
  if (depth === 3) return 26
  return 36
}

function neighborDepth(index: number, dir: -1 | 1) {
  return toc.value[index + dir]?.depth ?? toc.value[index]?.depth ?? 2
}

function updateThumb() {
  const container = tocListEl.value
  if (!container || !activeIds.value.length) {
    thumb.value = { top: 0, height: 0 }
    return
  }
  let upper = Number.POSITIVE_INFINITY
  let lower = 0
  for (const id of activeIds.value) {
    const element = container.querySelector<HTMLElement>(`a[href="#${CSS.escape(id)}"]`)
    if (!element) continue
    const styles = getComputedStyle(element)
    const padTop = Number.parseFloat(styles.paddingTop) || 0
    const padBottom = Number.parseFloat(styles.paddingBottom) || 0
    upper = Math.min(upper, element.offsetTop + padTop)
    lower = Math.max(lower, element.offsetTop + element.clientHeight - padBottom)
  }
  if (!Number.isFinite(upper) || lower <= upper) {
    thumb.value = { top: 0, height: 0 }
    return
  }
  thumb.value = { top: upper, height: lower - upper }
}

function updateTrack() {
  const container = tocListEl.value
  if (!container || !toc.value.length) {
    track.value = { width: 0, height: 0, mask: '' }
    thumb.value = { top: 0, height: 0 }
    return
  }
  let w = 0
  let h = 0
  const commands: string[] = []
  const links = [...container.querySelectorAll<HTMLAnchorElement>('a')]
  links.forEach((element, i) => {
    const item = toc.value[i]
    if (!item) return
    const styles = getComputedStyle(element)
    const offset = lineOffset(item.depth) + 1
    const top = element.offsetTop + (Number.parseFloat(styles.paddingTop) || 0)
    const bottom = element.offsetTop + element.clientHeight - (Number.parseFloat(styles.paddingBottom) || 0)
    w = Math.max(offset, w)
    h = Math.max(h, bottom)
    commands.push(`${i === 0 ? 'M' : 'L'}${offset} ${top}`)
    commands.push(`L${offset} ${bottom}`)
  })
  const width = w + 1
  const height = h
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><path d="${commands.join(' ')}" stroke="black" stroke-width="1" fill="none" /></svg>`
  track.value = {
    width,
    height,
    mask: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
  }
  updateThumb()
}

function setSideCollapsed(value: boolean) {
  sideCollapsed.value = value
  try { localStorage.setItem('docs-sidebar-collapsed', value ? '1' : '0') } catch {}
}

onMounted(() => {
  tocReady.value = true
  isMac.value = /Mac|iPhone|iPad/.test(navigator.platform)
  try { sideCollapsed.value = localStorage.getItem('docs-sidebar-collapsed') === '1' } catch {}
  window.addEventListener('keydown', onKey)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  document.addEventListener('click', onCopyClick)
  const main = document.querySelector('.docs-main')
  if (main) {
    mainObserver = new MutationObserver(() => syncActive())
    mainObserver.observe(main, { childList: true, subtree: true })
  }
  syncActive()
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  document.removeEventListener('click', onCopyClick)
  mainObserver?.disconnect()
  tocResize?.disconnect()
})

watch(() => route.path, () => {
  open.value = false
  closeSearch()
  if (import.meta.client) window.scrollTo(0, 0)
  syncActive()
}, { flush: 'post' })

watch(toc, () => {
  syncActive()
  updateTrack()
}, { flush: 'post' })
watch(activeIds, () => nextTick(updateThumb))
watch(tocListEl, (el) => {
  tocResize?.disconnect()
  tocResize = null
  if (!el) return
  tocResize = new ResizeObserver(() => updateTrack())
  tocResize.observe(el)
  updateTrack()
})
</script>

<template>
  <div class="docs-root" :class="{ 'is-collapsed': sideCollapsed }">
    <aside class="docs-side" :class="open ? 'docs-side--open' : ''">
      <div class="docs-side-inner">
      <div class="docs-brand">
        <NuxtLink :to="localePath('/docs')" class="docs-brand-link">
          <SiteLogo class="h-7 w-7" />
          <span>EasyTV</span>
        </NuxtLink>
        <button type="button" class="docs-icon-btn docs-collapse" :aria-label="sideCollapsed ? t('docs.expand') : t('docs.collapse')" @click="setSideCollapsed(!sideCollapsed)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /></svg>
        </button>
        <button type="button" class="docs-icon-btn docs-mobile-only" :aria-label="t('nav.docs')" @click="open = false">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
      </div>
      <div class="docs-side-search">
        <button type="button" class="docs-search-btn" @click="openSearch">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>
          <span>{{ t('docs.search') }}</span>
          <span class="docs-kbd-row">
            <kbd>{{ isMac ? '⌘' : 'Ctrl' }}</kbd>
            <kbd>K</kbd>
          </span>
        </button>
      </div>
      <nav class="docs-nav docs-scroll">
        <div v-if="activeSection !== 'api'">
          <div v-for="group in sideGroups" :key="group.id">
            <p v-if="group.id !== 'rest'" class="docs-nav-label">{{ t(`docs.groups.${group.id}`) }}</p>
            <NuxtLink
              v-for="p in group.pages"
              :key="`${group.id}-${p.slug}`"
              :to="pageTo(p)"
              class="docs-link"
              :class="{ 'docs-link--active': isPageActive(p) }"
              @click="open = false"
            >{{ p.title }}</NuxtLink>
          </div>
        </div>
        <div v-else>
          <NuxtLink
            v-for="p in sections[0]?.pages || []"
            :key="`api-${p.slug}`"
            :to="pageTo(p)"
            class="docs-link"
            :class="{ 'docs-link--active': isPageActive(p) }"
            @click="open = false"
          >{{ p.title }}</NuxtLink>
            <div v-for="cat in apiCategories" :key="cat.id" class="docs-fold" :class="{ 'is-open': isFoldOpen(cat.id) }">
              <button
                type="button"
                class="docs-fold-row"
                :aria-expanded="isFoldOpen(cat.id)"
                @click="toggleFold(cat.id)"
              >
                <span class="docs-fold-title">{{ cat.title }}</span>
                <span class="docs-fold-chevron" aria-hidden="true">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5 11 8l-5 4.5" /></svg>
                </span>
              </button>
              <div v-if="isFoldOpen(cat.id)" class="docs-fold-items">
            <NuxtLink
              v-for="ep in (cat.id === 'studio' ? API_TOP_LEVEL : [])"
              :key="ep.slug"
              :to="localePath(docPath(ep.slug))"
              class="docs-link docs-link--ep"
              :class="{ 'docs-link--active': isActive(ep.slug) }"
              @click="open = false"
            >
              <span>{{ pick(ep.title, locale) }}</span>
              <span class="docs-method-mini" :class="`is-${ep.method.toLowerCase()}`">{{ ep.method }}</span>
            </NuxtLink>
            <template v-for="g in cat.groups" :key="g.id">
              <div v-if="childGroups(g.id).length" class="docs-fold" :class="{ 'is-open': isFoldOpen(g.id) }">
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
                    v-if="g.overview"
                    :to="localePath(docPath(g.slug))"
                    class="docs-link docs-link--nested"
                    :class="{ 'docs-link--active': isActive(g.slug) }"
                    @click="open = false"
                  >{{ pick(g.overview, locale) }}</NuxtLink>
                  <div
                    v-for="child in childGroups(g.id)"
                    :key="child.id"
                    class="docs-fold"
                    :class="{ 'is-open': isFoldOpen(child.id) }"
                  >
                    <button
                      type="button"
                      class="docs-fold-row docs-fold-row--sub"
                      :aria-expanded="isFoldOpen(child.id)"
                      @click="toggleFold(child.id)"
                    >
                      <span class="docs-fold-title">{{ foldLabel(child) }}</span>
                      <span class="docs-fold-chevron" aria-hidden="true">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5 11 8l-5 4.5" /></svg>
                      </span>
                    </button>
                    <div v-if="isFoldOpen(child.id)" class="docs-fold-items">
                      <NuxtLink
                        v-for="ep in child.endpoints"
                        :key="ep.slug"
                        :to="localePath(docPath(ep.slug))"
                        class="docs-link docs-link--ep docs-link--deep"
                        :class="{ 'docs-link--active': isActive(ep.slug) }"
                        @click="open = false"
                      >
                        <span>{{ pick(ep.title, locale) }}</span>
                        <span class="docs-method-mini" :class="`is-${ep.method.toLowerCase()}`">{{ ep.method }}</span>
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
              <NuxtLink
                v-else-if="!g.endpoints.length"
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
              </div>
            </div>
        </div>
      </nav>
      <div class="docs-side-foot">
        <LangSwitch icon-only />
        <a :href="links.org" target="_blank" rel="noopener" class="docs-icon-btn" :aria-label="t('nav.github')">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5Z" /></svg>
        </a>
        <button type="button" class="docs-theme-toggle" :aria-label="t('nav.theme')" @click="toggle">
          <span class="docs-theme-ico" :class="{ 'is-on': !isDark }" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" /></svg>
          </span>
          <span class="docs-theme-ico" :class="{ 'is-on': isDark }" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>
          </span>
        </button>
      </div>
      </div>
    </aside>

    <div v-if="sideCollapsed" class="docs-collapsed-bar">
      <button type="button" class="docs-icon-btn" :aria-label="t('docs.expand')" @click="setSideCollapsed(false)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /></svg>
      </button>
      <button type="button" class="docs-icon-btn" :aria-label="t('docs.search')" @click="openSearch">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>
      </button>
    </div>

    <div class="docs-col">
      <header class="docs-mobile-bar">
        <NuxtLink :to="localePath('/docs')" class="docs-brand-link">
          <SiteLogo class="h-6 w-6" />
          <span>EasyTV</span>
        </NuxtLink>
        <div class="docs-mobile-actions">
          <button type="button" class="docs-icon-btn" :aria-label="t('docs.search')" @click="openSearch">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>
          </button>
          <button type="button" class="docs-icon-btn" :aria-label="t('nav.menu')" @click="open = true">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
        </div>
      </header>

      <nav class="docs-tabs-bar" :aria-label="t('nav.docs')">
        <NuxtLink
          v-for="id in DOC_SECTIONS"
          :key="id"
          :to="localePath(sectionHome[id])"
          class="docs-tab"
          :class="{ 'docs-tab--active': activeSection === id }"
        >{{ t(`docs.sections.${id}`) }}</NuxtLink>
      </nav>

      <div class="docs-stage">
        <div class="docs-page" :class="{ 'docs-page--toc': tocReady && toc.length }">
          <div class="docs-main">
            <slot />
          </div>
          <aside v-if="tocReady && toc.length" class="docs-toc">
          <p class="docs-toc-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
            {{ t('docs.toc') }}
          </p>
          <div class="docs-toc-scroll">
            <div
              v-if="track.mask"
              class="docs-toc-mask"
              :style="{ width: `${track.width}px`, height: `${track.height}px`, maskImage: track.mask, WebkitMaskImage: track.mask }"
            >
              <div class="docs-toc-thumb" :style="{ marginTop: `${thumb.top}px`, height: `${thumb.height}px` }" />
            </div>
            <div ref="tocListEl" class="docs-toc-list">
              <a
                v-for="(h, i) in toc"
                :key="h.id"
                :href="`#${h.id}`"
                class="docs-toc-link"
                :class="{ 'is-active': isTocActive(h.id) }"
                :style="{ paddingInlineStart: `${itemOffset(h.depth)}px` }"
              >
                <svg
                  v-if="lineOffset(h.depth) !== lineOffset(neighborDepth(i, -1))"
                  class="docs-toc-joint"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <line
                    :x1="lineOffset(neighborDepth(i, -1))"
                    y1="0"
                    :x2="lineOffset(h.depth)"
                    y2="12"
                    stroke="currentColor"
                    stroke-width="1"
                  />
                </svg>
                <span
                  class="docs-toc-rail"
                  :class="{
                    'is-after-step': lineOffset(h.depth) !== lineOffset(neighborDepth(i, -1)),
                    'is-before-step': lineOffset(h.depth) !== lineOffset(neighborDepth(i, 1)),
                  }"
                  :style="{ insetInlineStart: `${lineOffset(h.depth)}px` }"
                />
                {{ h.text }}
              </a>
            </div>
          </div>
        </aside>
        </div>
      </div>
      <DocsFooter />
    </div>

    <div v-if="open" class="docs-mask docs-mobile-only" @click="open = false" />

    <div v-if="searchOpen" class="docs-search-mask" @click.self="closeSearch">
      <div class="docs-search-dialog" role="dialog" :aria-label="t('docs.search')">
        <div class="docs-search-field" :class="{ 'has-list': query.trim() }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>
          <input
            ref="searchEl"
            v-model="query"
            type="search"
            :placeholder="t('docs.search')"
            @keydown="onSearchKey"
          >
        </div>
        <div v-if="query.trim()" class="docs-search-results">
          <p v-if="query.trim() && !searchHits.length" class="docs-search-empty">{{ t('docs.empty') }}</p>
          <button
            v-for="(hit, i) in searchHits"
            :key="`${hit.section}-${hit.slug}`"
            type="button"
            class="docs-hit"
            :class="{ 'is-active': i === activeHit }"
            @click="goHit(hit)"
            @mouseenter="activeHit = i"
          >
            <b>{{ hit.title }}</b>
            <small>{{ hit.section }}</small>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
