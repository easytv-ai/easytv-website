<script setup lang="ts">
definePageMeta({
  scrollToTop: false,
})

const { t } = useI18n()
const localePath = useLocalePath()
const toc = useDocsToc()
toc.value = []

useSeoMeta({
  title: () => `${t('docs.hub.title')} · EasyTV`,
  description: () => t('docs.hub.subtitle'),
})

const steps = computed(() => [
  { n: '1', to: '/docs/install-docker', title: t('docs.hub.step1_t'), desc: t('docs.hub.step1_d'), icon: 'box' },
  { n: '2', to: '/docs/gateway', title: t('docs.hub.step2_t'), desc: t('docs.hub.step2_d'), icon: 'plug' },
  { n: '3', to: '/docs/create', title: t('docs.hub.step3_t'), desc: t('docs.hub.step3_d'), icon: 'play' },
])

const deploys = computed(() => [
  { to: '/docs/install-docker', title: t('docs.hub.docker_t'), desc: t('docs.hub.docker_d'), icon: 'box' },
  { to: '/docs/install-source', title: t('docs.hub.source_t'), desc: t('docs.hub.source_d'), icon: 'code' },
])

const repos = computed(() => [
  { name: 'easytv-web', port: ':3005', to: '/docs/studio', title: t('docs.hub.web_t'), desc: t('docs.hub.web_d') },
  { name: 'easytv-api', port: ':8383', to: '/docs/api', title: t('docs.hub.api_repo_t'), desc: t('docs.hub.api_repo_d') },
  { name: 'easytv-manage', port: ':3006', to: '/docs/admin', title: t('docs.hub.manage_t'), desc: t('docs.hub.manage_d') },
  { name: 'easytv-partner', port: ':3010', to: '/docs/partner', title: t('docs.hub.partner_t'), desc: t('docs.hub.partner_d') },
])

const apis = computed(() => [
  { to: '/docs/api', title: t('docs.hub.api_t'), desc: t('docs.hub.api_d') },
  { to: '/docs/api-auth-login', title: t('docs.hub.auth_t'), desc: t('docs.hub.auth_d') },
  { to: '/docs/api-canvas-list', title: t('docs.hub.canvas_api_t'), desc: t('docs.hub.canvas_api_d') },
  { to: '/docs/api-task-create', title: t('docs.hub.task_t'), desc: t('docs.hub.task_d') },
  { to: '/docs/api-models-list', title: t('docs.hub.models_t'), desc: t('docs.hub.models_d') },
  { to: '/docs/api-wallet-get', title: t('docs.hub.wallet_t'), desc: t('docs.hub.wallet_d') },
  { to: '/docs/api-order-plans', title: t('docs.hub.order_t'), desc: t('docs.hub.order_d') },
  { to: '/docs/api-admin', title: t('docs.hub.admin_t'), desc: t('docs.hub.admin_d') },
  { to: '/docs/api-admin-model-price', title: t('docs.hub.price_t'), desc: t('docs.hub.price_d') },
  { to: '/docs/api-public-feed', title: t('docs.hub.pub_t'), desc: t('docs.hub.pub_d') },
  { to: '/docs/api-partner-apply', title: t('docs.hub.ptn_t'), desc: t('docs.hub.ptn_d') },
  { to: '/docs/api-user-self', title: t('docs.hub.user_t'), desc: t('docs.hub.user_d') },
])

const explore = computed(() => [
  { to: '/docs/canvas', title: t('docs.hub.guide_t'), desc: t('docs.hub.guide_d') },
  { to: '/docs/billing', title: t('docs.hub.bill_t'), desc: t('docs.hub.bill_d') },
  { to: '/docs/architecture', title: t('docs.hub.arch_t'), desc: t('docs.hub.arch_d') },
  { to: '/docs/admin', title: t('docs.hub.prod_t'), desc: t('docs.hub.prod_d') },
  { to: '/docs/partner', title: t('docs.hub.partner_t'), desc: t('docs.hub.partner_d') },
  { to: '/docs/faq', title: t('docs.hub.help_t'), desc: t('docs.hub.help_d') },
])
</script>

<template>
  <article class="docs-prose max-w-4xl">
      <h1>{{ t('docs.hub.title') }}</h1>
      <p class="docs-lead">{{ t('docs.hub.subtitle') }}</p>
      <p>{{ t('docs.hub.intro') }}</p>

      <h2>{{ t('docs.hub.steps') }}</h2>
      <div class="mt-4 grid gap-3 sm:grid-cols-3">
        <NuxtLink v-for="c in steps" :key="c.to" :to="localePath(c.to)" class="docs-card">
          <span class="docs-card-icon">
            <svg v-if="c.icon === 'box'" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7Z" /><path d="m3.3 7 8.7 5 8.7-5M12 22V12" /></svg>
            <svg v-else-if="c.icon === 'plug'" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.07 0l1.41-1.41a5 5 0 0 0-7.07-7.07L10 5.93" /><path d="M14 11a5 5 0 0 0-7.07 0L5.52 12.41a5 5 0 0 0 7.07 7.07L14 18.07" /></svg>
            <svg v-else class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 6.5v11l10-5.5L8 6.5Z" /></svg>
          </span>
          <div class="text-sm font-semibold">{{ c.n }}. {{ c.title }}</div>
          <p class="mt-1.5 text-[13px] leading-6" style="color: var(--fg-2)">{{ c.desc }}</p>
        </NuxtLink>
      </div>

      <h2>{{ t('docs.hub.deploys') }}</h2>
      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <NuxtLink v-for="c in deploys" :key="c.to" :to="localePath(c.to)" class="docs-card">
          <span class="docs-card-icon">
            <svg v-if="c.icon === 'box'" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7Z" /><path d="m3.3 7 8.7 5 8.7-5M12 22V12" /></svg>
            <svg v-else class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m16 18 6-6-6-6M8 6 2 12l6 6" /></svg>
          </span>
          <div class="text-sm font-semibold">{{ c.title }}</div>
          <p class="mt-1.5 text-[13px] leading-6" style="color: var(--fg-2)">{{ c.desc }}</p>
        </NuxtLink>
      </div>

      <h2>{{ t('docs.hub.repos') }}</h2>
      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <NuxtLink v-for="r in repos" :key="r.name" :to="localePath(r.to)" class="docs-card">
          <div class="flex items-center justify-between gap-2">
            <span class="font-mono text-[12px]" style="color: var(--accent)">{{ r.name }}</span>
            <span class="font-mono text-[11px]" style="color: var(--fg-3)">{{ r.port }}</span>
          </div>
          <div class="mt-2 text-sm font-semibold">{{ r.title }}</div>
          <p class="mt-1.5 text-[13px] leading-6" style="color: var(--fg-2)">{{ r.desc }}</p>
        </NuxtLink>
      </div>

      <h2>{{ t('docs.hub.shot_arch') }}</h2>
      <div class="mt-4">
        <SiteArchitecture compact />
      </div>

      <h2>{{ t('docs.hub.api_ref') }}</h2>
      <p class="docs-lead !mt-2 !mb-4">{{ t('docs.hub.api_ref_d') }}</p>
      <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <NuxtLink v-for="c in apis" :key="c.to" :to="localePath(c.to)" class="docs-card">
          <div class="text-sm font-semibold">{{ c.title }}</div>
          <p class="mt-1.5 text-[13px] leading-6" style="color: var(--fg-2)">{{ c.desc }}</p>
        </NuxtLink>
      </div>

      <h2>{{ t('docs.hub.explore') }}</h2>
      <div class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <NuxtLink v-for="c in explore" :key="c.to" :to="localePath(c.to)" class="docs-card">
          <div class="text-sm font-semibold">{{ c.title }}</div>
          <p class="mt-1.5 text-[13px] leading-6" style="color: var(--fg-2)">{{ c.desc }}</p>
        </NuxtLink>
      </div>
    </article>
</template>
