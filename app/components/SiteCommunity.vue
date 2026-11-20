<script setup lang="ts">
const { t } = useI18n()
const { rows } = useI18nRows()
const localePath = useLocalePath()
const links = useSiteLinks()
// 动态 :is 传字符串 'NuxtLink' 解析不到组件，会渲染成点不动的未知标签
const NuxtLink = resolveComponent('NuxtLink')
const cards = computed(() => {
  const [org, docs, demo] = rows<'title' | 'desc' | 'cta'>('community.cards')
  return [
    { ...org!, href: links.org, external: true },
    { ...docs!, href: localePath('/docs'), external: false },
    { ...demo!, href: links.demo, external: true },
  ]
})
</script>

<template>
  <section id="community" class="section">
    <div class="container-x">
      <SectionHead :eyebrow="t('community.eyebrow')" :title="t('community.title')" :subtitle="t('community.subtitle')" center />
      <div class="grid gap-4 md:grid-cols-3">
        <component
          :is="c.external ? 'a' : NuxtLink"
          v-for="c in cards"
          :key="c.title"
          class="card group p-6"
          v-bind="c.external ? { href: c.href, target: '_blank', rel: 'noopener' } : { to: c.href }"
        >
          <h3 class="text-lg font-semibold">{{ c.title }}</h3>
          <p class="mt-2 text-sm leading-relaxed" style="color: var(--fg-2)">{{ c.desc }}</p>
          <span class="mt-5 inline-flex items-center gap-1 text-sm font-semibold" style="color: var(--accent)">{{ c.cta }} <span class="transition group-hover:translate-x-0.5">→</span></span>
        </component>
      </div>
    </div>
  </section>
</template>
