<script setup lang="ts">
// 语言下拉菜单。首页导航和文档页头共用；compact 时小屏只留地球图标。
withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })

const { t, locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const open = ref(false)
const root = ref<HTMLElement | null>(null)

const items = computed(() => locales.value.map(l => ({ code: l.code, name: l.name || l.code, lang: l.language })))
const current = computed(() => items.value.find(l => l.code === locale.value)?.name || locale.value)

function onDocClick(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}
onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div ref="root" class="lang-switch">
    <button
      type="button"
      class="lang-switch-btn"
      :aria-label="t('nav.language')"
      aria-haspopup="menu"
      :aria-expanded="open"
      @click="open = !open"
    >
      <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>
      <span :class="compact ? 'hidden sm:inline' : ''">{{ current }}</span>
      <svg class="h-3 w-3 shrink-0 opacity-60" :class="compact ? 'hidden sm:block' : ''" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m3 4.5 3 3 3-3" /></svg>
    </button>
    <div v-if="open" class="lang-switch-menu" role="menu">
      <NuxtLink
        v-for="l in items"
        :key="l.code"
        :to="switchLocalePath(l.code)"
        :lang="l.lang"
        :hreflang="l.lang"
        role="menuitem"
        class="lang-switch-item"
        :class="{ 'is-active': l.code === locale }"
        :aria-current="l.code === locale ? 'true' : undefined"
        @click="open = false"
      >
        <span>{{ l.name }}</span>
        <svg v-if="l.code === locale" class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
      </NuxtLink>
    </div>
  </div>
</template>
