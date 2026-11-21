<script setup lang="ts">
// 品牌素材页：三组标志的 SVG / PNG 下载、配色、字体与用法。文件在 public/brand/。
const { t } = useI18n()
const localePath = useLocalePath()
const { isDark, toggle } = useTheme()

useSeoMeta({
  title: () => `${t('brand.title')} · EasyTV`,
  description: () => t('brand.subtitle'),
  ogTitle: () => `${t('brand.title')} · EasyTV`,
  ogDescription: () => t('brand.subtitle'),
})

type Kind = 'icon' | 'mark' | 'logo' | 'logo_on_dark'
interface Asset { kind: Kind, file: string, dark: boolean, wide?: boolean }
const groups: { key: 'color' | 'black' | 'white', assets: Asset[] }[] = [
  { key: 'color', assets: [
    { kind: 'icon', file: 'easytv-icon-color', dark: false },
    { kind: 'mark', file: 'easytv-mark-color', dark: false },
    { kind: 'logo', file: 'easytv-logo-color', dark: false, wide: true },
    // 第二行：同样的图标和图形放在深色底上的样子，文件与上一行相同
    { kind: 'icon', file: 'easytv-icon-color', dark: true },
    { kind: 'mark', file: 'easytv-mark-color', dark: true },
    { kind: 'logo_on_dark', file: 'easytv-logo-color-on-dark', dark: true, wide: true },
  ] },
  { key: 'black', assets: [
    { kind: 'icon', file: 'easytv-icon-black', dark: false },
    { kind: 'mark', file: 'easytv-mark-black', dark: false },
    { kind: 'logo', file: 'easytv-logo-black', dark: false, wide: true },
  ] },
  { key: 'white', assets: [
    { kind: 'icon', file: 'easytv-icon-white', dark: true },
    { kind: 'mark', file: 'easytv-mark-white', dark: true },
    { kind: 'logo', file: 'easytv-logo-white', dark: true, wide: true },
  ] },
]

const colors = [
  { key: 'orange', hex: '#FF5530', light: false },
  { key: 'pink', hex: '#EA5EC1', light: false },
  { key: 'violet', hex: '#7C5CFF', light: false },
  { key: 'ink', hex: '#0B0B0C', light: false },
  { key: 'paper', hex: '#F6F6F4', light: true },
]
const gradientCss = 'linear-gradient(135deg, #FF5530 0%, #EA5EC1 55%, #7C5CFF 100%)'
const rules = ['prefer', 'space', 'size', 'dont'] as const

const copied = ref('')
let timer: ReturnType<typeof setTimeout> | null = null
async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = text
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => { copied.value = '' }, 1600)
  }
  catch { /* 剪贴板不可用时不提示 */ }
}
onUnmounted(() => { if (timer) clearTimeout(timer) })
</script>

<template>
  <div>
    <header class="sticky top-0 z-40 border-b backdrop-blur-md" style="border-color: var(--line-2); background: color-mix(in srgb, var(--bg) 78%, transparent)">
      <div class="container-x flex h-16 items-center justify-between gap-3">
        <NuxtLink :to="localePath('/')" class="flex shrink-0 items-center gap-2.5">
          <SiteLogo class="h-7 w-7" />
          <span class="text-[15px] font-semibold tracking-tight">EasyTV</span>
        </NuxtLink>
        <div class="flex shrink-0 items-center gap-1 sm:gap-1.5">
          <NuxtLink :to="localePath('/')" class="nav-link nav-link--wide">{{ t('brand.back_home') }}</NuxtLink>
          <LangSwitch compact />
          <button type="button" :aria-label="t('nav.theme')" class="nav-icon-btn" @click="toggle">
            <svg v-if="isDark" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" /></svg>
            <svg v-else class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>
          </button>
        </div>
      </div>
    </header>

    <main class="container-x pb-24">
      <section class="py-14 sm:py-20">
        <span class="eyebrow">{{ t('brand.eyebrow') }}</span>
        <h1 class="h-display mt-6">{{ t('brand.title') }}</h1>
        <p class="lead mt-5 max-w-2xl">{{ t('brand.subtitle') }}</p>
        <div class="mt-8 flex flex-wrap items-center gap-3">
          <a href="/brand/easytv-brand-assets.zip" download class="btn btn-primary">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14" /></svg>
            {{ t('brand.download_all') }}
          </a>
          <span class="text-sm" style="color: var(--fg-3)">{{ t('brand.download_all_note') }}</span>
        </div>
      </section>

      <section v-for="g in groups" :key="g.key" class="brand-section">
        <h2 class="h-section">{{ t(`brand.groups.${g.key}.title`) }}</h2>
        <p class="mt-3 max-w-2xl text-[15px] leading-relaxed" style="color: var(--fg-2)">{{ t(`brand.groups.${g.key}.desc`) }}</p>
        <div class="brand-grid mt-8">
          <article v-for="a in g.assets" :key="`${a.file}-${a.dark}`" class="brand-card" :class="{ 'brand-card--wide': a.wide }">
            <div class="brand-stage" :class="a.dark ? 'brand-stage--dark' : 'brand-stage--light'">
              <img :src="`/brand/${a.file}.svg`" :alt="`EasyTV ${t(`brand.kinds.${a.kind}`)}`" :class="a.wide ? 'brand-img--wide' : 'brand-img'" loading="lazy" decoding="async">
            </div>
            <div class="brand-meta">
              <span class="text-sm font-medium">{{ t(`brand.kinds.${a.kind}`) }}</span>
              <span class="flex items-center gap-1.5">
                <a :href="`/brand/${a.file}.svg`" :download="`${a.file}.svg`" class="brand-dl">SVG</a>
                <a :href="`/brand/${a.file}.png`" :download="`${a.file}.png`" class="brand-dl">PNG</a>
              </span>
            </div>
          </article>
        </div>
      </section>

      <section class="brand-section">
        <h2 class="h-section">{{ t('brand.colors.title') }}</h2>
        <p class="mt-3 max-w-2xl text-[15px] leading-relaxed" style="color: var(--fg-2)">{{ t('brand.colors.desc') }}</p>
        <div class="brand-colors mt-8">
          <button v-for="c in colors" :key="c.hex" type="button" class="brand-swatch" @click="copy(c.hex)">
            <span class="brand-swatch-chip" :style="{ background: c.hex }" />
            <span class="mt-3 block text-sm font-medium">{{ t(`brand.colors.${c.key}`) }}</span>
            <span class="mt-0.5 block font-mono text-[13px]" style="color: var(--fg-3)">{{ copied === c.hex ? t('docs.api.copied') : c.hex }}</span>
          </button>
        </div>
        <button type="button" class="brand-gradient mt-4" @click="copy(gradientCss)">
          <span class="brand-gradient-bar" :style="{ background: gradientCss }" />
          <span class="mt-3 block text-sm font-medium">{{ t('brand.colors.gradient') }}</span>
          <span class="mt-0.5 block break-all font-mono text-[13px]" style="color: var(--fg-3)">{{ copied === gradientCss ? t('docs.api.copied') : gradientCss }}</span>
        </button>
      </section>

      <section class="brand-section grid gap-10 lg:grid-cols-2">
        <div>
          <h2 class="h-section">{{ t('brand.type.title') }}</h2>
          <p class="mt-3 text-[15px] leading-relaxed" style="color: var(--fg-2)">{{ t('brand.type.desc') }}</p>
          <div class="card mt-6 p-6">
            <div class="text-5xl font-semibold tracking-[-0.035em]">EasyTV</div>
            <div class="mt-4 font-mono text-[13px]" style="color: var(--fg-3)">Geist SemiBold · -3.5%</div>
            <a href="https://fonts.google.com/specimen/Geist" target="_blank" rel="noopener" class="mt-4 inline-flex text-sm font-medium hover:underline" style="color: var(--accent)">Google Fonts ↗</a>
          </div>
        </div>
        <div>
          <h2 class="h-section">{{ t('brand.usage.title') }}</h2>
          <ul class="mt-6 space-y-3">
            <li v-for="r in rules" :key="r" class="flex gap-3 text-[15px] leading-relaxed" style="color: var(--fg-2)">
              <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style="background: var(--accent)" />
              <span>{{ t(`brand.usage.${r}`) }}</span>
            </li>
          </ul>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
</template>
