<script setup lang="ts">
const { t, tm, rt } = useI18n()
const localePath = useLocalePath()
const links = useSiteLinks()
const cards = computed(() => {
  const raw = tm('community.cards') as any[]
  return [
    { title: rt(raw[0].title), desc: rt(raw[0].desc), cta: rt(raw[0].cta), href: links.org, external: true },
    { title: rt(raw[1].title), desc: rt(raw[1].desc), cta: rt(raw[1].cta), href: localePath('/docs'), external: false },
    { title: rt(raw[2].title), desc: rt(raw[2].desc), cta: rt(raw[2].cta), href: links.demo, external: true },
  ]
})
</script>

<template>
  <section id="community" class="section">
    <div class="container-x">
      <SectionHead :eyebrow="t('community.eyebrow')" :title="t('community.title')" :subtitle="t('community.subtitle')" center />
      <div class="grid gap-4 md:grid-cols-3">
        <component
          :is="c.external ? 'a' : 'NuxtLink'"
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
