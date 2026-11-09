<script setup lang="ts">
import { API_GROUPS, API_TOP_LEVEL, groupEntrySlug, pick, type ApiGroup } from '~/utils/api-catalog'
import { docPath } from '~/utils/docs'
import DocsCopyMarkdown from '~/components/docs/DocsCopyMarkdown.vue'

const props = defineProps<{
  title: string
  description?: string
  html?: string
  markdown?: string
}>()

const { t, locale } = useI18n()
const localePath = useLocalePath()
const toc = useDocsToc()

const ICONS: Record<string, string> = {
  health: 'M22 12h-4l-3 9L9 3l-3 9H2',
  auth: 'M12 10V7a4 4 0 1 0-8 0v3M4 10h8v10H4z',
  user: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  project: 'M4 6h7l2 2h7v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z',
  canvas: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  asset: 'M4 5h16v14H4zM4 15l4-4 3 3 4-5 5 6',
  task: 'M8 6.5v11l10-5.5L8 6.5Z',
  models: 'M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM12 12l8-4.5M12 12v9M12 12L4 7.5',
  work: 'M4 7h16v12H4zM8 7V5h8v2',
  skill: 'M12 3l1.8 5.5H20l-4.6 3.4 1.8 5.6L12 14.8 6.8 17.5l1.8-5.6L4 8.5h6.2z',
  wallet: 'M3 7h18v12H3zM16 13h4M3 7l2-3h14l2 3',
  order: 'M7 3h10v18l-5-2-5 2V3z',
  team: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M17 11a4 4 0 1 0 0-8M21 21v-2a4 4 0 0 0-3-3.87M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  media: 'M4 6h16M4 12h10M4 18h16M17 9l5 3-5 3V9z',
  public: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18',
  admin: 'M12 3l8 4v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V7l8-4z',
  partner: 'M12 3l2.5 6.5L21 10l-5 4.2L17.5 21 12 17.5 6.5 21 8 14.2 3 10l6.5-.5z',
}

function isOps(g: ApiGroup) {
  return g.id === 'admin' || g.id.startsWith('admin-') || g.id === 'partner'
}

const studio = computed(() => API_GROUPS.filter(g => !isOps(g)))
const ops = computed(() => API_GROUPS.filter(g => isOps(g)))

const health = computed(() => API_TOP_LEVEL[0])

const catalogMarkdown = computed(() => {
  const loc = locale.value
  const lines = [props.markdown?.trim() || `# ${props.title}`]
  lines.push('', `## ${t('docs.api.cat_studio')}`, '')
  if (health.value) {
    lines.push(`- [${pick(health.value.title, loc)}](/docs/${health.value.slug}) — ${pick(health.value.summary, loc)}`)
  }
  for (const g of studio.value) {
    lines.push(`- [${pick(g.title, loc)}](/docs/${groupEntrySlug(g)}) — ${pick(g.summary, loc)}`)
  }
  lines.push('', `## ${t('docs.api.cat_ops')}`, '')
  for (const g of ops.value) {
    lines.push(`- [${pick(g.title, loc)}](/docs/${groupEntrySlug(g)}) — ${pick(g.summary, loc)}`)
  }
  return `${lines.join('\n').trim()}\n`
})

watchEffect(() => {
  toc.value = [
    { id: 'overview', text: t('docs.api.overview'), depth: 2 },
    { id: 'studio', text: t('docs.api.cat_studio'), depth: 2 },
    { id: 'ops', text: t('docs.api.cat_ops'), depth: 2 },
  ]
})
onUnmounted(() => {
  toc.value = []
})

function toGroup(g: ApiGroup) {
  return localePath(docPath(groupEntrySlug(g)))
}
</script>

<template>
  <article class="docs-prose docs-api-overview">
    <h1>{{ title }}</h1>
    <div class="docs-page-actions">
      <DocsCopyMarkdown :markdown="catalogMarkdown" />
    </div>
    <p v-if="description" class="docs-lead">{{ description }}</p>

    <div class="docs-callout">
      <div class="docs-callout-k">{{ t('docs.api.callout') }}</div>
      <p>{{ t('docs.api.callout_d') }}</p>
    </div>

    <section id="overview">
      <h2>{{ t('docs.api.overview') }}</h2>
      <div class="docs-body" v-html="html" />
    </section>

    <section id="studio">
      <h2>{{ t('docs.api.cat_studio') }}</h2>
      <p class="docs-cat-lead">{{ t('docs.api.cat_studio_d') }}</p>
      <div class="docs-api-grid">
        <NuxtLink
          v-if="health"
          :to="localePath(docPath(health.slug))"
          class="docs-api-tile"
        >
          <span class="docs-api-tile-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path :d="ICONS.health" /></svg>
          </span>
          <span class="docs-api-tile-title">{{ pick(health.title, locale) }}</span>
          <span class="docs-api-tile-desc">{{ pick(health.summary, locale) }}</span>
        </NuxtLink>
        <NuxtLink
          v-for="g in studio"
          :key="g.id"
          :to="toGroup(g)"
          class="docs-api-tile"
        >
          <span class="docs-api-tile-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path :d="ICONS[g.id] || ICONS.public" /></svg>
          </span>
          <span class="docs-api-tile-title">{{ pick(g.title, locale) }}</span>
          <span class="docs-api-tile-desc">{{ pick(g.summary, locale) }}</span>
        </NuxtLink>
      </div>
    </section>

    <section id="ops">
      <h2>{{ t('docs.api.cat_ops') }}</h2>
      <p class="docs-cat-lead">{{ t('docs.api.cat_ops_d') }}</p>
      <div class="docs-api-grid">
        <NuxtLink
          v-for="g in ops"
          :key="g.id"
          :to="toGroup(g)"
          class="docs-api-tile"
        >
          <span class="docs-api-tile-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path :d="ICONS[g.id.startsWith('admin') ? 'admin' : g.id] || ICONS.admin" /></svg>
          </span>
          <span class="docs-api-tile-title">{{ pick(g.title, locale) }}</span>
          <span class="docs-api-tile-desc">{{ pick(g.summary, locale) }}</span>
        </NuxtLink>
      </div>
    </section>
  </article>
</template>
