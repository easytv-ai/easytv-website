<script setup lang="ts">
const props = defineProps<{ markdown: string }>()

const { t } = useI18n()
const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

watch(() => props.markdown, () => {
  copied.value = false
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})

function fallbackCopy(text: string) {
  const el = document.createElement('textarea')
  el.value = text
  el.setAttribute('readonly', '')
  el.style.position = 'fixed'
  el.style.top = '0'
  el.style.left = '0'
  el.style.opacity = '0'
  document.body.appendChild(el)
  el.focus()
  el.select()
  const ok = document.execCommand('copy')
  document.body.removeChild(el)
  if (!ok) throw new Error('copy failed')
}

async function copy() {
  const text = props.markdown?.trim()
  if (!text) return
  try {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text)
      }
      catch {
        fallbackCopy(text)
      }
    }
    else {
      fallbackCopy(text)
    }
    copied.value = true
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      copied.value = false
      timer = null
    }, 1800)
  }
  catch { /* ignore */ }
}
</script>

<template>
  <button
    v-if="markdown"
    type="button"
    class="docs-md-copy"
    :class="{ 'is-copied': copied }"
    @click="copy"
  >
    <svg v-if="copied" class="docs-md-copy-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
    </svg>
    <svg v-else class="docs-md-copy-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="5" y="5" width="8" height="9" rx="1.4" />
      <path d="M11 5V3.6A1.6 1.6 0 0 0 9.4 2H3.6A1.6 1.6 0 0 0 2 3.6v7.8A1.6 1.6 0 0 0 3.6 13H5" />
    </svg>
    {{ copied ? t('docs.api.copied_md') : t('docs.api.copy_md') }}
  </button>
</template>
