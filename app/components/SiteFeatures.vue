<script setup lang="ts">
const { t, tm, rt } = useI18n()
const items = computed(() => (tm('features.items') as any[]).map(i => ({ title: rt(i.title), desc: rt(i.desc) })))
const icons = [
  'M4 6h16M4 12h16M4 18h10', 'M5 12h14M12 5l7 7-7 7', 'M4 4h16v16H4zM8 8h8M8 12h8M8 16h5',
  'M12 3l9 6-9 6-9-6zM3 15l9 6 9-6', 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM8 12h8', 'M3 7h18v10H3zM7 7v10M17 7v10',
  'M14 3v4h4M6 3h8l6 6v12H6z', 'M4 4h6v6H4zM14 14h6v6h-6zM10 7h4M17 10v4', 'M12 2l2.5 6.5L21 9l-5 4.5L17.5 21 12 17.5 6.5 21 8 13.5 3 9l6.5-.5z',
  'M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0zM4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1', 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  'M2 7h20v10H2zM2 11h20', 'M3 3h18v18H3zM3 9h18M9 21V9', 'M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20zM12 2a15 15 0 0 0 0 20',
]
</script>

<template>
  <section id="features" class="section">
    <div class="container-x">
      <SectionHead :eyebrow="t('features.eyebrow')" :title="t('features.title')" :subtitle="t('features.subtitle')" />
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article v-for="(it, i) in items" :key="i" class="card p-5">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg" style="background: var(--panel-2); color: var(--accent)">
            <svg class="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path :d="icons[i % icons.length]" /></svg>
          </div>
          <h3 class="mt-4 text-[15px] font-semibold">{{ it.title }}</h3>
          <p class="mt-2 text-sm leading-relaxed" style="color: var(--fg-2)">{{ it.desc }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
