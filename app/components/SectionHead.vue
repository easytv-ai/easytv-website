<script setup lang="ts">
defineProps<{ eyebrow: string, title: string, subtitle?: string, center?: boolean }>()
</script>

<template>
  <div :class="['mb-12 max-w-3xl', center ? 'mx-auto text-center' : '']">
    <span class="eyebrow">{{ eyebrow }}</span>
    <h2 class="h-section mt-4">{{ title }}</h2>
    <p v-if="subtitle" class="lead mt-4">{{ subtitle }}</p>
  </div>
</template>
