<script setup lang="ts">
import { DOC_PAGES, docPath } from '~/utils/docs'
import { loadDoc, neighbors } from '~/utils/docs-render'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

const slug = computed(() => {
  const raw = route.params.slug
  const parts = Array.isArray(raw) ? raw : raw ? [raw] : []
  return parts.filter(Boolean).join('/')
})

const doc = computed(() => loadDoc(locale.value, slug.value))
const around = computed(() => neighbors(slug.value))
const prevTitle = computed(() => (around.value.prev ? loadDoc(locale.value, around.value.prev.slug)?.title : ''))
const nextTitle = computed(() => (around.value.next ? loadDoc(locale.value, around.value.next.slug)?.title : ''))

if (!doc.value) {
  throw createError({ statusCode: 404, statusMessage: 'Doc not found' })
}

useSeoMeta({
  title: () => `${doc.value?.title || 'Docs'} · EasyTV`,
  description: () => doc.value?.description || '',
})
</script>

<template>
  <DocsShell v-if="doc">
    <div class="lg:grid lg:grid-cols-[minmax(0,48rem)_13rem] lg:items-start lg:gap-10">
      <article class="docs-prose min-w-0 max-w-3xl">
        <p class="eyebrow">{{ t(`docs.sections.${DOC_PAGES.find(p => p.slug === slug)?.section || 'start'}`) }}</p>
        <h1>{{ doc.title }}</h1>
        <p v-if="doc.description" class="docs-lead">{{ doc.description }}</p>
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
      <nav v-if="doc.toc.length" class="docs-toc">
        <div class="mb-2 text-[11px] font-semibold uppercase tracking-wider" style="color: var(--fg-3)">{{ t('docs.toc') }}</div>
        <a v-for="h in doc.toc" :key="h.id" :href="`#${h.id}`" class="block py-1 text-[13px]" :style="{ paddingLeft: h.depth === 3 ? '12px' : '0', color: 'var(--fg-2)' }">{{ h.text }}</a>
      </nav>
    </div>
    <div class="mt-14 flex max-w-3xl gap-4 border-t pt-8" style="border-color: var(--line)">
      <NuxtLink v-if="around.prev" :to="localePath(docPath(around.prev.slug))" class="card min-w-0 flex-1 p-4 no-underline">
        <div class="text-xs" style="color: var(--fg-3)">{{ t('docs.prev') }}</div>
        <div class="mt-1 truncate font-semibold">{{ prevTitle }}</div>
      </NuxtLink>
      <NuxtLink v-if="around.next" :to="localePath(docPath(around.next.slug))" class="card min-w-0 flex-1 p-4 text-right no-underline">
        <div class="text-xs" style="color: var(--fg-3)">{{ t('docs.next') }}</div>
        <div class="mt-1 truncate font-semibold">{{ nextTitle }}</div>
      </NuxtLink>
    </div>
  </DocsShell>
</template>
