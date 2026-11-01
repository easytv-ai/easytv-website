<script setup lang="ts">
const { t, tm, rt } = useI18n()
const cols = computed(() => (tm('roadmap.cols') as any[]).map(c => ({ title: rt(c.title), items: (c.items as any[]).map(rt) })))
</script>

<template>
  <section id="roadmap" class="section" style="background: var(--bg-soft)">
    <div class="container-x">
      <SectionHead :eyebrow="t('roadmap.eyebrow')" :title="t('roadmap.title')" center />
      <div class="grid gap-4 md:grid-cols-3">
        <div v-for="(c, i) in cols" :key="c.title" class="card p-6">
          <div class="flex items-center gap-3">
            <span class="h-2 w-2 rounded-full" :style="{ background: ['var(--accent)', 'var(--accent-2)', 'var(--accent-3)'][i] }" />
            <h3 class="font-semibold">{{ c.title }}</h3>
          </div>
          <ul class="mt-4 space-y-2.5">
            <li v-for="it in c.items" :key="it" class="flex gap-2.5 text-sm" style="color: var(--fg-2)">
              <span class="mt-2 h-1 w-1 shrink-0 rounded-full" style="background: var(--fg-3)" />{{ it }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
