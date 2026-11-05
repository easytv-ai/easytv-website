<script setup lang="ts">
const { t, tm, rt } = useI18n()
const steps = computed(() => (tm('quickstart.steps') as any[]).map(s => ({ title: rt(s.title), desc: rt(s.desc) })))
const tabs = computed(() => (tm('quickstart.tabs') as any[]).map(x => rt(x)))
const active = ref(0)
const snippets = [
  [
    { c: 'git clone https://github.com/easytv-ai/easytv-api.git && cd easytv-api' },
    { c: 'cp .env.example .env' },
    { m: '# 填 SQL_DSN / ROOT_PASSWORD，Redis 可选' },
    { c: 'go run . --port 8383' },
    { m: '# → http://127.0.0.1:8383，首次启动自动 AutoMigrate 并创建 root' },
    { c: 'go run ./cmd/seed', m2: '   # 可选：灌入演示作品与技能' },
  ],
  [
    { c: 'git clone https://github.com/easytv-ai/easytv-web.git && cd easytv-web' },
    { c: 'pnpm install' },
    { c: 'pnpm dev' },
    { m: '# → http://localhost:3005，.env.development 里填 NUXT_PUBLIC_API_BASE_URL' },
    { c: 'pnpm deploy', m2: '      # Cloudflare Workers（wrangler）' },
  ],
  [
    { c: 'git clone https://github.com/easytv-ai/easytv-manage.git && cd easytv-manage' },
    { c: 'pnpm install' },
    { c: 'pnpm dev' },
    { m: '# → http://localhost:3006，用 ROOT_USERNAME / ROOT_PASSWORD 登录' },
    { m: '# 系统设置 · 网关 → 填网关地址与密钥 → 拉取模型 → 导入定价' },
  ],
  [
    { c: 'git clone https://github.com/easytv-ai/easytv-partner.git && cd easytv-partner' },
    { c: 'pnpm install' },
    { c: 'pnpm dev' },
    { m: '# → http://localhost:3010，用普通 EasyTV 账号登录后申请入驻' },
  ],
]
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
