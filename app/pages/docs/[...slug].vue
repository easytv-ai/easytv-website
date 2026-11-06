<script setup lang="ts">
import { DOC_PAGES, docPath } from '~/utils/docs'
import { loadDoc, neighbors } from '~/utils/docs-render'
import { API_GROUPS, findApiEndpoint, pageTitle } from '~/utils/api-catalog'
import ApiEndpointDoc from '~/components/docs/ApiEndpointDoc.vue'
import ApiGroupLinks from '~/components/docs/ApiGroupLinks.vue'

definePageMeta({
  scrollToTop: false,
})

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

const slug = computed(() => {
  const raw = route.params.slug
  const parts = Array.isArray(raw) ? raw : raw ? [raw] : []
  return parts.filter(Boolean).join('/')
})

const endpoint = computed(() => findApiEndpoint(slug.value))
const group = computed(() => API_GROUPS.find(g => g.slug === slug.value) || null)
const doc = computed(() => loadDoc(locale.value, slug.value))
const around = computed(() => neighbors(slug.value))

function titleOf(pageSlug?: string) {
  if (!pageSlug) return ''
  return pageTitle(pageSlug, locale.value) || loadDoc(locale.value, pageSlug)?.title || pageSlug
}

const prevTitle = computed(() => titleOf(around.value.prev?.slug))
const nextTitle = computed(() => titleOf(around.value.next?.slug))
const sectionTitle = computed(() => t(`docs.sections.${DOC_PAGES.find(p => p.slug === slug.value)?.section || 'start'}`))
const toc = useDocsToc()

if (!endpoint.value && !doc.value) {
  throw createError({ statusCode: 404, statusMessage: 'Doc not found' })
}

watchEffect(() => {
  if (endpoint.value) return
  toc.value = doc.value?.toc ?? []
})
onUnmounted(() => {
  toc.value = []
})

useSeoMeta({
  title: () => `${endpoint.value ? pageTitle(slug.value, locale.value) : (doc.value?.title || 'Docs')} · EasyTV`,
  description: () => endpoint.value
    ? (locale.value.startsWith('en') ? endpoint.value.summary.en : endpoint.value.summary.zh)
    : (doc.value?.description || ''),
})
</script>

<template>
  <ApiEndpointDoc v-if="endpoint" :endpoint="endpoint" />
  <article v-else-if="doc" class="docs-prose">
    <p class="mb-3 text-[12px]" style="color: var(--fg-3)">{{ sectionTitle }}</p>
    <h1>{{ doc.title }}</h1>
    <p v-if="doc.description" class="docs-lead">{{ doc.description }}</p>
    <ApiGroupLinks v-if="group" :group="group" />
    <div class="docs-body" v-html="doc.html" />
    <p class="mt-10 text-sm" style="color: var(--fg-3)">
      <a
        :href="`https://github.com/easytv-ai/easytv-website/edit/main/content/docs/${locale}/${slug}.md`"
        target="_blank"
        rel="noopener"
        class="hover:underline"
        style="color: var(--fg-2)"
      >{{ t('docs.edit') }} ↗</a>
    </p>
  </article>
  <div class="docs-pager">
    <NuxtLink v-if="around.prev" :to="localePath(docPath(around.prev.slug))" class="docs-card docs-pager-link">
      <div class="docs-pager-k">← {{ t('docs.prev') }}</div>
      <div class="docs-pager-t truncate">{{ prevTitle }}</div>
    </NuxtLink>
    <div v-else />
    <NuxtLink v-if="around.next" :to="localePath(docPath(around.next.slug))" class="docs-card docs-pager-link text-right">
      <div class="docs-pager-k">{{ t('docs.next') }} →</div>
      <div class="docs-pager-t truncate">{{ nextTitle }}</div>
    </NuxtLink>
  </div>
</template>
