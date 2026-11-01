<script setup lang="ts">
const { t } = useI18n()
const links = useSiteLinks()
const flow = ['script', 'subject', 'shot', 'voice', 'compose', 'work'] as const
const stats = ['repos', 'locales', 'api', 'models'] as const
</script>

<template>
  <section id="top" class="relative overflow-hidden">
    <div class="grid-bg pointer-events-none absolute inset-0" />
    <div class="pointer-events-none absolute left-1/2 top-[-10rem] h-[32rem] w-[48rem] -translate-x-1/2 rounded-full blur-3xl" style="background: radial-gradient(closest-side, var(--glow), transparent)" />

    <div class="container-x relative pt-20 pb-16 sm:pt-28 sm:pb-24">
      <div class="mx-auto max-w-3xl text-center">
        <span class="eyebrow">{{ t('hero.eyebrow') }}</span>
        <h1 class="h-display mt-6">
          {{ t('hero.title1') }}<br>
          <span class="gradient-text">{{ t('hero.title2') }}</span>
        </h1>
        <p class="lead mx-auto mt-6 max-w-2xl">{{ t('hero.subtitle') }}</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a :href="links.org" target="_blank" rel="noopener" class="btn btn-primary">{{ t('hero.cta_github') }}</a>
          <a href="#quickstart" class="btn btn-ghost">{{ t('hero.cta_deploy') }}</a>
          <a :href="links.demo" target="_blank" rel="noopener" class="btn btn-ghost">{{ t('hero.cta_demo') }} ↗</a>
        </div>
      </div>

      <!-- 流水线示意 -->
      <div class="card relative mx-auto mt-16 max-w-5xl overflow-hidden p-4 sm:p-6" style="background: color-mix(in srgb, var(--panel) 85%, transparent)">
        <div class="flex items-center gap-1.5 pb-4" style="color: var(--fg-3)">
          <span class="h-2.5 w-2.5 rounded-full" style="background: #ff5f57" /><span class="h-2.5 w-2.5 rounded-full" style="background: #febc2e" /><span class="h-2.5 w-2.5 rounded-full" style="background: #28c840" />
          <span class="ml-3 font-mono text-[11px]">easytv-web / canvas</span>
        </div>
        <div class="relative grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <div v-for="(k, i) in flow" :key="k" class="relative rounded-xl border p-3 text-left" :class="i % 2 ? 'anim-float' : ''" :style="{ borderColor: 'var(--line)', background: 'var(--panel-2)', animationDelay: `${i * 0.4}s` }">
            <div class="flex items-center justify-between">
              <span class="font-mono text-[10px] uppercase tracking-wider" style="color: var(--fg-3)">node {{ String(i + 1).padStart(2, '0') }}</span>
              <span class="relative flex h-2 w-2">
                <span class="anim-ring absolute inline-flex h-full w-full rounded-full" :style="{ background: i === 2 ? 'var(--accent)' : 'transparent' }" />
                <span class="relative inline-flex h-2 w-2 rounded-full" :style="{ background: i < 3 ? 'var(--accent)' : 'var(--fg-3)' }" />
              </span>
            </div>
            <div class="mt-2 text-sm font-medium">{{ t(`hero.flow.${k}`) }}</div>
            <div class="mt-3 h-14 rounded-lg" :style="{ background: `linear-gradient(135deg, color-mix(in srgb, var(--accent) ${12 + i * 6}%, var(--panel)), color-mix(in srgb, var(--accent-3) ${10 + i * 5}%, var(--panel)))` }" />
            <svg v-if="i < flow.length - 1" class="absolute -right-3 top-1/2 hidden h-3 w-3 -translate-y-1/2 lg:block" viewBox="0 0 12 12" style="color: var(--fg-3)"><path d="M0 6h9M6 2l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" class="anim-dash" /></svg>
          </div>
        </div>
      </div>

      <dl class="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
        <div v-for="s in stats" :key="s" class="text-center">
          <dd class="text-2xl font-semibold tracking-tight sm:text-3xl">{{ t(`hero.stats_v.${s}`) }}</dd>
          <dt class="mt-1 text-xs sm:text-sm" style="color: var(--fg-3)">{{ t(`hero.stats.${s}`) }}</dt>
        </div>
      </dl>
    </div>
  </section>
</template>
