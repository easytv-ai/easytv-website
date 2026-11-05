<script setup lang="ts">
definePageMeta({
  scrollToTop: false,
})
</script>

<template>
  <DocsShell>
    <NuxtPage :page-key="route => route.path" />
  </DocsShell>
</template>
