<script setup lang="ts">
import type { NuxtError } from '#app'
import { DEFAULT_LOCALE, SITE_LOCALES, localePrefix } from '~/utils/locales'

const props = defineProps<{ error: NuxtError }>()
const { t, locale, loadLocaleMessages } = useI18n()

// 404 时路由没匹配上，语种不一定已按前缀切好，这里自己从地址里认。
// 服务端渲染错误页走的是内部地址，原始地址在 error.url 里；客户端跳转出错时没有，退回当前路由。
const route = useRoute()
const code = computed(() => {
  const raw = (props.error as NuxtError & { url?: string })?.url || route.path
  const first = raw.replace(/^https?:\/\/[^/]+/, '').split(/[/?#]/)[1] || ''
  return SITE_LOCALES.find(l => l.code === first)?.code || DEFAULT_LOCALE
})
if (code.value !== locale.value) await loadLocaleMessages(code.value)

const notFound = computed(() => props.error?.statusCode === 404)
const tr = (key: string) => t(key, {}, { locale: code.value })
const home = computed(() => localePrefix(code.value) || '/')
const docs = computed(() => `${localePrefix(code.value)}/docs`)

useHead({
  title: () => `${tr(notFound.value ? 'error.not_found_title' : 'error.failed_title')} · EasyTV`,
  htmlAttrs: { lang: () => SITE_LOCALES.find(l => l.code === code.value)?.language },
})
</script>

<template>
  <div class="relative flex min-h-screen flex-col overflow-hidden bg-[var(--bg)] text-[var(--fg)] antialiased">
    <div class="grid-bg pointer-events-none absolute inset-0" />
    <header class="container-x relative flex h-16 items-center">
      <a :href="home" class="flex items-center gap-2.5" @click.prevent="clearError({ redirect: home })">
        <SiteLogo class="h-7 w-7" />
        <span class="text-[15px] font-semibold tracking-tight">EasyTV</span>
      </a>
    </header>
    <main class="container-x relative flex flex-1 flex-col items-center justify-center pb-24 text-center">
      <p class="gradient-text font-mono text-6xl font-semibold tracking-tight sm:text-7xl">{{ error?.statusCode || 500 }}</p>
      <h1 class="h-section mt-6">{{ tr(notFound ? 'error.not_found_title' : 'error.failed_title') }}</h1>
      <p class="lead mx-auto mt-4 max-w-xl">{{ tr(notFound ? 'error.not_found_desc' : 'error.failed_desc') }}</p>
      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
        <a :href="home" class="btn btn-primary" @click.prevent="clearError({ redirect: home })">{{ tr('error.home') }}</a>
        <a :href="docs" class="btn btn-ghost" @click.prevent="clearError({ redirect: docs })">{{ tr('error.docs') }}</a>
      </div>
    </main>
  </div>
</template>
