<script setup lang="ts">
import type { ApiGroup } from '~/utils/api-catalog'
import { pick } from '~/utils/api-catalog'

defineProps<{ group: ApiGroup }>()

const { locale } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <div v-if="group.endpoints.length" class="docs-ep-index">
    <NuxtLink
      v-for="ep in group.endpoints"
      :key="ep.slug"
      :to="localePath(`/docs/${ep.slug}`)"
      class="docs-ep-index-row"
    >
      <span class="docs-method" :class="`is-${ep.method.toLowerCase()}`">{{ ep.method }}</span>
      <span class="docs-ep-index-path">{{ ep.path }}</span>
      <span class="docs-ep-index-title">{{ pick(ep.title, locale) }}</span>
    </NuxtLink>
  </div>
</template>
