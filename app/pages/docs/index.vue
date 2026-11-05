<script setup lang="ts">
import { docPath } from '~/utils/docs'
import { loadDocNav } from '~/utils/docs-render'

const { t, locale } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: () => `${t('docs.hub.title')} · EasyTV`,
  description: () => t('docs.hub.subtitle'),
})

const cards = computed(() => [
  { to: '/docs/quickstart', title: t('docs.hub.start_t'), desc: t('docs.hub.start_d') },
  { to: '/docs/install', title: t('docs.hub.install_t'), desc: t('docs.hub.install_d') },
  { to: '/docs/canvas', title: t('docs.hub.guide_t'), desc: t('docs.hub.guide_d') },
  { to: '/docs/billing', title: t('docs.hub.bill_t'), desc: t('docs.hub.bill_d') },
  { to: '/docs/gateway', title: t('docs.hub.gw_t'), desc: t('docs.hub.gw_d') },
  { to: '/docs/deploy', title: t('docs.hub.prod_t'), desc: t('docs.hub.prod_d') },
  { to: '/docs/api', title: t('docs.hub.api_t'), desc: t('docs.hub.api_d') },
  { to: '/docs/architecture', title: t('docs.hub.arch_t'), desc: t('docs.hub.arch_d') },
  { to: '/docs/faq', title: t('docs.hub.help_t'), desc: t('docs.hub.help_d') },
])

const nav = computed(() => loadDocNav(locale.value))
</script>

<template>
  <DocsShell>
    <div class="max-w-3xl">
      <p class="eyebrow">{{ t('docs.hub.eyebrow') }}</p>
      <h1 class="h-section mt-4">{{ t('docs.hub.title') }}</h1>
      <p class="lead mt-4">{{ t('docs.hub.subtitle') }}</p>
    </div>
    <div class="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <NuxtLink v-for="c in cards" :key="c.to" :to="localePath(c.to)" class="card block p-5">
        <h2 class="text-base font-semibold">{{ c.title }}</h2>
        <p class="mt-2 text-sm leading-relaxed" style="color: var(--fg-2)">{{ c.desc }}</p>
        <span class="mt-4 inline-block text-sm font-semibold" style="color: var(--accent)">{{ t('docs.hub.open') }} →</span>
      </NuxtLink>
    </div>
    <div class="mt-12 max-w-3xl">
      <h2 class="text-lg font-semibold">{{ t('docs.hub.all') }}</h2>
      <ul class="mt-4 grid gap-2 sm:grid-cols-2">
        <li v-for="p in nav" :key="p.slug">
          <NuxtLink :to="localePath(docPath(p.slug))" class="text-sm hover:underline" style="color: var(--fg-2)">{{ p.title }}</NuxtLink>
        </li>
      </ul>
    </div>
  </DocsShell>
</template>
