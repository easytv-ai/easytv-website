<script setup lang="ts">
const { t } = useI18n()
const { rows, list } = useI18nRows()
const steps = computed(() => rows<'title' | 'desc'>('quickstart.steps'))
const tabs = computed(() => list('quickstart.tabs'))
const active = ref(0)
// 注释行走多语言；命令本身不翻译
const snippets = computed(() => [
  [
    { c: 'git clone https://github.com/easytv-ai/easytv-api.git && cd easytv-api' },
    { c: 'cp .env.example .env' },
    { m: `# ${t('quickstart.code.api_env')}` },
    { c: 'go run . --port 8383' },
    { m: `# → http://127.0.0.1:8383 · ${t('quickstart.code.api_run')}` },
    { c: 'go run ./cmd/seed', m2: `   # ${t('quickstart.code.api_seed')}` },
  ],
  [
    { c: 'git clone https://github.com/easytv-ai/easytv-web.git && cd easytv-web' },
    { c: 'pnpm install' },
    { c: 'pnpm dev' },
    { m: `# → http://localhost:3005 · ${t('quickstart.code.web_env')}` },
    { c: 'pnpm deploy', m2: '      # Cloudflare Workers (wrangler)' },
  ],
  [
    { c: 'git clone https://github.com/easytv-ai/easytv-manage.git && cd easytv-manage' },
    { c: 'pnpm install' },
    { c: 'pnpm dev' },
    { m: `# → http://localhost:3006 · ${t('quickstart.code.manage_login')}` },
    { m: `# ${t('quickstart.code.manage_gateway')}` },
  ],
  [
    { c: 'git clone https://github.com/easytv-ai/easytv-partner.git && cd easytv-partner' },
    { c: 'pnpm install' },
    { c: 'pnpm dev' },
    { m: `# → http://localhost:3010 · ${t('quickstart.code.partner_login')}` },
  ],
])
</script>

<template>
  <section id="quickstart" class="section">
    <div class="container-x grid gap-12 lg:grid-cols-5">
      <div class="min-w-0 lg:col-span-2">
        <span class="eyebrow">{{ t('quickstart.eyebrow') }}</span>
        <h2 class="h-section mt-4">{{ t('quickstart.title') }}</h2>
        <p class="lead mt-4">{{ t('quickstart.subtitle') }}</p>
        <ol class="mt-8 space-y-5">
          <li v-for="(s, i) in steps" :key="i" class="flex gap-4">
            <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold" style="background: var(--fg); color: var(--bg)">{{ i + 1 }}</span>
            <div>
              <div class="font-semibold">{{ s.title }}</div>
              <p class="mt-1 text-sm leading-relaxed" style="color: var(--fg-2)">{{ s.desc }}</p>
            </div>
          </li>
        </ol>
        <p class="mt-6 text-xs" style="color: var(--fg-3)">{{ t('quickstart.note') }}</p>
      </div>
      <div class="min-w-0 lg:col-span-3">
        <div class="code">
          <div class="flex gap-1 border-b p-2" style="border-color: rgba(255,255,255,.08)">
            <button v-for="(tab, i) in tabs" :key="tab" type="button" class="rounded-lg px-3 py-1.5 font-mono text-xs transition" :style="{ background: active === i ? 'rgba(255,255,255,.1)' : 'transparent', color: active === i ? '#fff' : '#9ca3af' }" @click="active = i">{{ tab }}</button>
          </div>
          <pre class="overflow-x-auto p-5 font-mono"><template v-for="(l, i) in snippets[active]" :key="i"><span v-if="l.c"><span class="kw">$ </span>{{ l.c }}<span v-if="l.m2" class="cm">{{ l.m2 }}</span></span><span v-else class="cm">{{ l.m }}</span>
</template></pre>
        </div>
      </div>
    </div>
  </section>
</template>
