<script setup lang="ts">
defineProps<{ editUrl: string }>()

const { t } = useI18n()
const open = ref(false)
const copied = ref(false)
const root = ref<HTMLElement | null>(null)

function onDocClick(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false
}
onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))

async function copyLink() {
  try {
    await navigator.clipboard.writeText(location.href)
    copied.value = true
    window.setTimeout(() => {
      copied.value = false
      open.value = false
    }, 900)
  }
  catch { /* ignore */ }
}
</script>

<template>
  <div ref="root" class="docs-open">
    <button
      type="button"
      class="docs-md-copy"
      aria-haspopup="menu"
      :aria-expanded="open"
      @click="open = !open"
    >
      {{ t('docs.open') }}
      <svg class="docs-md-copy-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="m4 6 4 4 4-4" />
      </svg>
    </button>
    <div v-if="open" class="docs-open-menu" role="menu">
      <a :href="editUrl" target="_blank" rel="noopener" role="menuitem" @click="open = false">{{ t('docs.edit') }}</a>
      <button type="button" role="menuitem" @click="copyLink">{{ copied ? t('docs.link_copied') : t('docs.copy_link') }}</button>
    </div>
  </div>
</template>
