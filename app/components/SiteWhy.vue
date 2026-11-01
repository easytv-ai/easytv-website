<script setup lang="ts">
const { t, tm, rt } = useI18n()
const cards = computed(() => (tm('why.cards') as any[]).map(c => ({ k: rt(c.k), title: rt(c.title), desc: rt(c.desc) })))
</script>

<template>
  <section id="why" class="section" style="background: var(--bg-soft)">
    <div class="container-x grid gap-12 lg:grid-cols-5">
      <div class="min-w-0 lg:col-span-2">
        <span class="eyebrow">{{ t('why.eyebrow') }}</span>
        <h2 class="h-section mt-4">{{ t('why.title') }}</h2>
        <p class="lead mt-6">{{ t('why.p1') }}</p>
        <p class="lead mt-4">{{ t('why.p2') }}</p>
        <div class="code mt-8 p-4 font-mono">
          <div class="cm"># new-api → tokens</div>
          <div><span class="kw">POST</span> /v1/chat/completions</div>
          <div class="cm mt-3"># easytv → credits</div>
          <div><span class="kw">POST</span> /v1/videos        <span class="cm">→ 25 pts / s</span></div>
          <div><span class="kw">POST</span> /v1/images/generations <span class="cm">→ 8 pts / img</span></div>
          <div><span class="kw">POST</span> /user/generation/task  <span class="cm">→ pre-deduct · refund on fail</span></div>
        </div>
      </div>
      <div class="grid min-w-0 gap-4 sm:grid-cols-2 lg:col-span-3">
        <article v-for="c in cards" :key="c.k" class="card p-6">
          <span class="font-mono text-[11px] uppercase tracking-wider" style="color: var(--accent)">{{ c.k }}</span>
          <h3 class="mt-2 text-lg font-semibold">{{ c.title }}</h3>
          <p class="mt-2 text-sm leading-relaxed" style="color: var(--fg-2)">{{ c.desc }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
