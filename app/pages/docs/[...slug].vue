<script setup lang="ts">
import { docPath } from '~/utils/docs'
import { highlightDocHtml, loadDoc, loadDocSource, neighbors } from '~/utils/docs-render'
import DocsCopyMarkdown from '~/components/docs/DocsCopyMarkdown.vue'
import DocsOpenMenu from '~/components/docs/DocsOpenMenu.vue'
import DocsFeedback from '~/components/docs/DocsFeedback.vue'
import { API_GROUPS, findApiEndpoint, groupEntrySlug, hasCatalogLocale, pageTitle, pick } from '~/utils/api-catalog'
import DocsUntranslated from '~/components/docs/DocsUntranslated.vue'
import ApiEndpointDoc from '~/components/docs/ApiEndpointDoc.vue'
import ApiCatalog from '~/components/docs/ApiCatalog.vue'
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
const { data: prettyHtml } = await useAsyncData(
  () => `docs-html:${locale.value}:${slug.value}`,
  () => highlightDocHtml(doc.value?.html || ''),
  { watch: [slug, locale] },
)
const docHtml = computed(() => prettyHtml.value || doc.value?.html || '')
const docMarkdown = computed(() => loadDocSource(locale.value, slug.value) || '')
const around = computed(() => neighbors(slug.value))
// 接口页的文案来自目录（只有 zh / en），其余页面看正文实际取自哪个语种
const untranslated = computed(() => {
  if (endpoint.value) return !hasCatalogLocale(locale.value)
  return !!doc.value && doc.value.sourceLocale !== locale.value
})

function titleOf(pageSlug?: string) {
  if (!pageSlug) return ''
  return pageTitle(pageSlug, locale.value) || loadDoc(locale.value, pageSlug)?.title || pageSlug
}

const prevTitle = computed(() => titleOf(around.value.prev?.slug))
const nextTitle = computed(() => titleOf(around.value.next?.slug))

function methodOf(pageSlug?: string) {
  if (!pageSlug) return ''
  return findApiEndpoint(pageSlug)?.method || ''
}

const prevMethod = computed(() => methodOf(around.value.prev?.slug))
const nextMethod = computed(() => methodOf(around.value.next?.slug))
const editUrl = computed(() => {
  if (!doc.value) return ''
  return `https://github.com/easytv-ai/easytv-website/edit/main/content/docs/${doc.value.sourceLocale}/${slug.value}.md`
})
const toc = useDocsToc()

const groupRedirect = computed(() => API_GROUPS.find(g => g.slug === slug.value && g.endpoints.length) || null)
watch(groupRedirect, async (g) => {
  if (!g) return
  await navigateTo(localePath(docPath(groupEntrySlug(g))), { redirectCode: 301, replace: true })
}, { immediate: true })

if (!endpoint.value && !doc.value && !groupRedirect.value) {
  throw createError({ statusCode: 404, statusMessage: 'Doc not found' })
}

watchEffect((onCleanup) => {
  if (endpoint.value) return
  if (slug.value === 'api') return
  const items = doc.value?.toc ?? []
  toc.value = items
  // 新页面会先写上自己的目录。卸载时只清掉仍属于本页的那份，避免把后写的冲掉。
  onCleanup(() => {
    if (toc.value === items) toc.value = []
  })
})

useSeoMeta({
  title: () => `${endpoint.value ? pageTitle(slug.value, locale.value) : (doc.value?.title || 'Docs')} · EasyTV`,
  description: () => endpoint.value
    ? pick(endpoint.value.summary, locale.value)
    : (doc.value?.description || ''),
})
</script>

<!-- eslint-disable vue/no-multiple-template-root -- 正文与翻页器并列两个根节点；本站没开页面过渡，暂不改结构 -->
<template>
  <DocsUntranslated v-if="untranslated" />
  <ApiCatalog
    v-if="slug === 'api' && doc"
    :title="doc.title"
    :description="doc.description"
    :html="docHtml"
    :markdown="docMarkdown"
  />
  <ApiEndpointDoc v-else-if="endpoint" :endpoint="endpoint" />
  <article v-else-if="doc && !groupRedirect" class="docs-prose">
    <h1>{{ doc.title }}</h1>
    <p v-if="doc.description" class="docs-lead">{{ doc.description }}</p>
    <div class="docs-page-actions">
      <DocsCopyMarkdown :markdown="docMarkdown" />
      <DocsOpenMenu v-if="editUrl" :edit-url="editUrl" />
    </div>
    <ApiGroupLinks v-if="group" :group="group" />
    <!-- eslint-disable-next-line vue/no-v-html -- 正文由仓库内的 Markdown 渲染，不含用户输入 -->
    <div class="docs-body" v-html="docHtml" />
  </article>
  <DocsFeedback v-if="endpoint || (doc && !groupRedirect)" />
  <div v-if="around.prev || around.next" class="docs-pager" :class="{ 'is-split': around.prev && around.next }">
    <NuxtLink v-if="around.prev" :to="localePath(docPath(around.prev.slug))" class="docs-pager-link">
      <span class="docs-pager-name">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
        {{ prevTitle }}
        <span v-if="prevMethod" class="docs-method-mini" :class="`is-${prevMethod.toLowerCase()}`">{{ prevMethod }}</span>
      </span>
      <span class="docs-pager-k">{{ t('docs.prev') }}</span>
    </NuxtLink>
    <NuxtLink v-if="around.next" :to="localePath(docPath(around.next.slug))" class="docs-pager-link is-next">
      <span class="docs-pager-name">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
        <span v-if="nextMethod" class="docs-method-mini" :class="`is-${nextMethod.toLowerCase()}`">{{ nextMethod }}</span>
        {{ nextTitle }}
      </span>
      <span class="docs-pager-k">{{ t('docs.next') }}</span>
    </NuxtLink>
  </div>
</template>
