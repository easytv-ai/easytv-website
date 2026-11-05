<script setup lang="ts">
const { t, tm, rt } = useI18n()
const links = useSiteLinks()
const repos = computed(() => (tm('arch.repos') as any[]).map(r => ({ name: rt(r.name), stack: rt(r.stack), desc: rt(r.desc) })))
const repoLink: Record<string, string> = { 'easytv-web': links.web, 'easytv-api': links.api, 'easytv-manage': links.manage, 'easytv-partner': links.partner }
</script>

<template>
  <section id="arch" class="section">
    <div class="container-x">
      <SectionHead :eyebrow="t('arch.eyebrow')" :title="t('arch.title')" :subtitle="t('arch.subtitle')" />

      <div class="card overflow-x-auto p-4 sm:p-8">
        <svg viewBox="0 0 1104 448" class="mx-auto block min-w-[800px] w-full" role="img" :aria-label="t('arch.title')" font-family="Geist, ui-sans-serif, system-ui, sans-serif">
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5 0 10z" fill="var(--fg-3)" /></marker>
            <linearGradient id="acc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--accent)" /><stop offset="1" stop-color="var(--accent-3)" /></linearGradient>
          </defs>

          <!-- clients -->
          <g>
            <rect x="36" y="40" width="232" height="96" rx="14" fill="var(--panel-2)" stroke="var(--line)" />
            <text x="56" y="74" font-size="16" font-weight="600" fill="var(--fg)">{{ t('arch.nodes.web') }}</text>
            <text x="56" y="94" font-size="12" fill="var(--fg-2)">{{ t('arch.nodes.web_d') }}</text>
            <text x="56" y="112" font-size="11" fill="var(--fg-3)">{{ t('arch.nodes.web_d2') }}</text>
            <rect x="36" y="168" width="232" height="96" rx="14" fill="var(--panel-2)" stroke="var(--line)" />
            <text x="56" y="204" font-size="16" font-weight="600" fill="var(--fg)">{{ t('arch.nodes.manage') }}</text>
            <text x="56" y="228" font-size="12" fill="var(--fg-2)">{{ t('arch.nodes.manage_d') }}</text>
          </g>

          <!-- api -->
          <g>
            <rect x="424" y="40" width="256" height="224" rx="16" fill="var(--panel-2)" stroke="url(#acc)" stroke-width="1.5" />
            <text x="444" y="76" font-size="18" font-weight="600" fill="var(--fg)">{{ t('arch.nodes.api') }}</text>
            <text x="444" y="100" font-size="12" fill="var(--fg-2)">{{ t('arch.nodes.api_d') }}</text>
            <g font-size="11" fill="var(--fg-2)">
              <rect x="444" y="118" width="216" height="26" rx="6" fill="var(--panel)" stroke="var(--line)" /><text x="456" y="135">router · controller · service</text>
              <rect x="444" y="152" width="216" height="26" rx="6" fill="var(--panel)" stroke="var(--line)" /><text x="456" y="169">generation_task · compose_job</text>
              <rect x="444" y="186" width="216" height="26" rx="6" fill="var(--panel)" stroke="var(--line)" /><text x="456" y="203">billing · quota · audit</text>
              <rect x="444" y="220" width="216" height="26" rx="6" fill="var(--panel)" stroke="var(--line)" /><text x="456" y="237">{{ t('arch.nodes.ffmpeg') }}</text>
            </g>
          </g>

          <!-- gateway + models -->
          <g>
            <rect x="836" y="40" width="232" height="96" rx="14" fill="var(--panel-2)" stroke="var(--line)" />
            <text x="856" y="74" font-size="15" font-weight="600" fill="var(--fg)">{{ t('arch.nodes.gateway') }}</text>
            <text x="856" y="94" font-size="11" fill="var(--fg-2)" font-family="Geist Mono, monospace">/v1/chat · /v1/images</text>
            <text x="856" y="112" font-size="11" fill="var(--fg-2)" font-family="Geist Mono, monospace">/v1/videos</text>
            <rect x="836" y="168" width="232" height="96" rx="14" fill="var(--panel-2)" stroke="var(--line)" stroke-dasharray="4 4" />
            <text x="856" y="204" font-size="13" font-weight="600" fill="var(--fg)">AI models</text>
            <text x="856" y="226" font-size="11" fill="var(--fg-2)">{{ t('arch.nodes.models') }}</text>
            <text x="856" y="246" font-size="11" fill="var(--fg-2)">{{ t('arch.nodes.models2') }}</text>
          </g>

          <!-- infra -->
          <g>
            <rect x="424" y="328" width="120" height="72" rx="12" fill="var(--panel-2)" stroke="var(--line)" />
            <text x="484" y="370" font-size="12" text-anchor="middle" fill="var(--fg)">{{ t('arch.nodes.db') }}</text>
            <rect x="560" y="328" width="120" height="72" rx="12" fill="var(--panel-2)" stroke="var(--line)" />
            <text x="620" y="362" font-size="12" text-anchor="middle" fill="var(--fg)">{{ t('arch.nodes.oss') }}</text>
            <text x="620" y="380" font-size="11" text-anchor="middle" fill="var(--fg-2)">{{ t('arch.nodes.oss_d') }}</text>
          </g>

          <!-- edges (under labels) -->
          <g fill="none" stroke="var(--fg-3)" stroke-width="1.5" marker-end="url(#arr)">
            <path d="M268 88 H424" class="anim-dash" />
            <path d="M268 216 H424" class="anim-dash" />
            <path d="M680 88 H836" class="anim-dash" />
            <path d="M952 136 V168" />
            <path d="M484 264 V328" />
            <path d="M620 264 V328" />
          </g>

          <!-- edge labels sit in the column gaps, with a panel fill so they don't collide with boxes -->
          <g font-size="11" font-family="Geist Mono, monospace">
            <g>
              <rect x="286" y="66" width="120" height="40" rx="8" fill="var(--panel)" stroke="var(--line)" />
              <text x="346" y="82" text-anchor="middle" fill="var(--fg-2)">{{ t('arch.edges.web1') }}</text>
              <text x="346" y="96" text-anchor="middle" fill="var(--fg-3)">{{ t('arch.edges.web2') }}</text>
            </g>
            <g>
              <rect x="301" y="204" width="90" height="24" rx="8" fill="var(--panel)" stroke="var(--line)" />
              <text x="346" y="220" text-anchor="middle" fill="var(--fg-2)">{{ t('arch.edges.manage') }}</text>
            </g>
            <g>
              <rect x="698" y="66" width="120" height="40" rx="8" fill="var(--panel)" stroke="var(--line)" />
              <text x="758" y="82" text-anchor="middle" fill="var(--fg-2)">{{ t('arch.edges.gateway1') }}</text>
              <text x="758" y="96" text-anchor="middle" fill="var(--fg-3)">{{ t('arch.edges.gateway2') }}</text>
            </g>
          </g>
        </svg>
      </div>

      <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
