<script setup lang="ts">
const { t, tm, rt } = useI18n()
const links = useSiteLinks()
const repos = computed(() => (tm('arch.repos') as any[]).map(r => ({ name: rt(r.name), stack: rt(r.stack), desc: rt(r.desc) })))
const repoLink: Record<string, string> = { 'easytv-web': links.web, 'easytv-api': links.api, 'easytv-manage': links.manage }
</script>

<template>
  <section id="arch" class="section">
    <div class="container-x">
      <SectionHead :eyebrow="t('arch.eyebrow')" :title="t('arch.title')" :subtitle="t('arch.subtitle')" />

      <div class="card overflow-x-auto p-4 sm:p-8">
        <svg viewBox="0 0 960 420" class="mx-auto block min-w-[720px] w-full" role="img" :aria-label="t('arch.title')" font-family="Geist, ui-sans-serif, system-ui, sans-serif">
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5 0 10z" fill="var(--fg-3)" /></marker>
            <linearGradient id="acc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--accent)" /><stop offset="1" stop-color="var(--accent-3)" /></linearGradient>
          </defs>

          <!-- clients -->
          <g>
            <rect x="40" y="40" width="220" height="92" rx="14" fill="var(--panel-2)" stroke="var(--line)" />
            <text x="60" y="72" font-size="16" font-weight="600" fill="var(--fg)">{{ t('arch.nodes.web') }}</text>
            <text x="60" y="98" font-size="12" fill="var(--fg-2)">{{ t('arch.nodes.web_d') }}</text>
            <rect x="40" y="160" width="220" height="92" rx="14" fill="var(--panel-2)" stroke="var(--line)" />
            <text x="60" y="192" font-size="16" font-weight="600" fill="var(--fg)">{{ t('arch.nodes.manage') }}</text>
            <text x="60" y="218" font-size="12" fill="var(--fg-2)">{{ t('arch.nodes.manage_d') }}</text>
          </g>

          <!-- api -->
          <g>
            <rect x="360" y="40" width="240" height="212" rx="16" fill="var(--panel-2)" stroke="url(#acc)" stroke-width="1.5" />
            <text x="384" y="76" font-size="18" font-weight="600" fill="var(--fg)">{{ t('arch.nodes.api') }}</text>
            <text x="384" y="100" font-size="12" fill="var(--fg-2)">{{ t('arch.nodes.api_d') }}</text>
            <g font-size="11" fill="var(--fg-2)">
              <rect x="384" y="120" width="192" height="24" rx="6" fill="var(--panel)" stroke="var(--line)" /><text x="396" y="136">router · controller · service</text>
              <rect x="384" y="152" width="192" height="24" rx="6" fill="var(--panel)" stroke="var(--line)" /><text x="396" y="168">generation_task · compose_job</text>
              <rect x="384" y="184" width="192" height="24" rx="6" fill="var(--panel)" stroke="var(--line)" /><text x="396" y="200">billing · quota · audit</text>
              <rect x="384" y="216" width="192" height="24" rx="6" fill="var(--panel)" stroke="var(--line)" /><text x="396" y="232">{{ t('arch.nodes.ffmpeg') }}</text>
            </g>
          </g>

          <!-- gateway + models -->
          <g>
            <rect x="700" y="40" width="220" height="92" rx="14" fill="var(--panel-2)" stroke="var(--line)" />
            <text x="720" y="72" font-size="15" font-weight="600" fill="var(--fg)">{{ t('arch.nodes.gateway') }}</text>
            <text x="720" y="98" font-size="10.5" fill="var(--fg-2)" font-family="Geist Mono, monospace">/v1/chat · /v1/images · /v1/videos</text>
            <rect x="700" y="160" width="220" height="92" rx="14" fill="var(--panel-2)" stroke="var(--line)" stroke-dasharray="4 4" />
            <text x="720" y="192" font-size="13" font-weight="600" fill="var(--fg)">AI models</text>
            <text x="720" y="214" font-size="11" fill="var(--fg-2)">{{ t('arch.nodes.models') }}</text>
            <text x="720" y="234" font-size="11" fill="var(--fg-2)">{{ t('arch.nodes.models2') }}</text>
          </g>

          <!-- infra -->
          <g>
            <rect x="360" y="300" width="112" height="72" rx="12" fill="var(--panel-2)" stroke="var(--line)" />
            <text x="416" y="342" font-size="12" text-anchor="middle" fill="var(--fg)">{{ t('arch.nodes.db') }}</text>
            <rect x="488" y="300" width="112" height="72" rx="12" fill="var(--panel-2)" stroke="var(--line)" />
            <text x="544" y="342" font-size="12" text-anchor="middle" fill="var(--fg)">{{ t('arch.nodes.oss') }}</text>
          </g>

          <!-- edges -->
          <g fill="none" stroke="var(--fg-3)" stroke-width="1.5" marker-end="url(#arr)">
            <path d="M260 86 H356" class="anim-dash" />
            <path d="M260 206 H356" class="anim-dash" />
            <path d="M600 86 H696" class="anim-dash" />
            <path d="M810 132 V156" />
            <path d="M416 252 V296" />
            <path d="M544 252 V296" />
          </g>
          <g font-size="11" fill="var(--fg-3)" font-family="Geist Mono, monospace">
            <text x="268" y="78">Bearer + EasyTV-User</text>
            <text x="268" y="198">/admin/*</text>
            <text x="612" y="78">OpenAI-compatible</text>
          </g>
        </svg>
      </div>

      <div class="mt-6 grid gap-4 lg:grid-cols-3">
        <a v-for="r in repos" :key="r.name" :href="repoLink[r.name]" target="_blank" rel="noopener" class="card block p-5">
          <div class="flex items-center justify-between">
            <span class="font-mono text-sm font-semibold">{{ r.name }}</span>
            <span class="text-xs" style="color: var(--fg-3)">↗</span>
          </div>
          <div class="mt-1 font-mono text-[11px]" style="color: var(--accent)">{{ r.stack }}</div>
          <p class="mt-3 text-sm leading-relaxed" style="color: var(--fg-2)">{{ r.desc }}</p>
        </a>
      </div>
    </div>
  </section>
</template>
