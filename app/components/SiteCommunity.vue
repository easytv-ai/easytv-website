<script setup lang="ts">
const { t, tm, rt } = useI18n()
const links = useSiteLinks()
const hrefs = [links.org, links.apiDoc, links.demo]
const cards = computed(() => (tm('community.cards') as any[]).map((c, i) => ({ title: rt(c.title), desc: rt(c.desc), cta: rt(c.cta), href: hrefs[i] })))
</script>

<template>
  <section id="community" class="section">
    <div class="container-x">
      <SectionHead :eyebrow="t('community.eyebrow')" :title="t('community.title')" :subtitle="t('community.subtitle')" center />
      <div class="grid gap-4 md:grid-cols-3">
        <a v-for="c in cards" :key="c.title" :href="c.href" target="_blank" rel="noopener" class="card group p-6">
          <h3 class="text-lg font-semibold">{{ c.title }}</h3>
          <p class="mt-2 text-sm leading-relaxed" style="color: var(--fg-2)">{{ c.desc }}</p>
          <span class="mt-5 inline-flex items-center gap-1 text-sm font-semibold" style="color: var(--accent)">{{ c.cta }} <span class="transition group-hover:translate-x-0.5">→</span></span>
        </a>
      </div>
    </div>
  </section>
</template>
