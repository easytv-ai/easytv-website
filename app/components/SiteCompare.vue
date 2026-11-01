<script setup lang="ts">
const { t, tm, rt } = useI18n()
const rows = computed(() => (tm('compare.rows') as any[]).map(r => ({ k: rt(r.k), a: rt(r.a), b: rt(r.b) })))
</script>

<template>
  <section id="compare" class="section" style="background: var(--bg-soft)">
    <div class="container-x">
      <SectionHead :eyebrow="t('compare.eyebrow')" :title="t('compare.title')" :subtitle="t('compare.subtitle')" center />
      <div class="card overflow-x-auto">
        <table class="w-full min-w-[640px] text-sm">
          <thead>
            <tr style="background: var(--panel-2)">
              <th class="w-1/4 px-4 py-3 text-left font-medium sm:px-6" style="color: var(--fg-3)"></th>
              <th class="px-4 py-3 text-left sm:px-6">
                <span class="inline-flex items-center gap-2 font-semibold"><SiteLogo class="h-5 w-5" />{{ t('compare.col_easytv') }}</span>
              </th>
              <th class="px-4 py-3 text-left font-medium sm:px-6" style="color: var(--fg-2)">{{ t('compare.col_saas') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in rows" :key="r.k" class="border-t" style="border-color: var(--line-2)">
              <td class="px-4 py-3.5 font-medium sm:px-6">{{ r.k }}</td>
              <td class="px-4 py-3.5 sm:px-6">
                <span class="inline-flex items-start gap-2"><span class="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] text-white" style="background: linear-gradient(135deg, var(--accent), var(--accent-2))">✓</span>{{ r.a }}</span>
              </td>
              <td class="px-4 py-3.5 sm:px-6" style="color: var(--fg-2)">{{ r.b }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
