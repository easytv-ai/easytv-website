<script setup lang="ts">
import { DOC_SECTIONS, type DocSection } from '~/utils/docs'

const { t } = useI18n()
const localePath = useLocalePath()
const links = useSiteLinks()
const year = new Date().getFullYear()

const sectionHome: Record<DocSection, string> = {
  start: '/docs',
  install: '/docs/install',
  guide: '/docs/studio',
  api: '/docs/api',
  ref: '/docs/faq',
}

const repos = [
  { key: 'web', href: links.web },
  { key: 'api', href: links.api },
  { key: 'manage', href: links.manage },
  { key: 'partner', href: links.partner },
] as const
</script>

<template>
  <footer class="docs-foot">
    <p class="docs-foot-intro">{{ t('docs.footer_intro') }}</p>
    <div class="docs-foot-grid">
      <div class="docs-foot-brand">
        <a href="https://easytv.ai" target="_blank" rel="noopener">
          <span>EasyTV</span>
          <small>easytv.ai</small>
        </a>
        <a :href="links.org" target="_blank" rel="noopener">
          <span>GitHub</span>
          <small>github.com/easytv-ai</small>
        </a>
      </div>
      <div>
        <h3>{{ t('docs.footer_about') }}</h3>
        <NuxtLink :to="localePath('/')">{{ t('docs.home') }}</NuxtLink>
        <NuxtLink :to="localePath('/brand')">{{ t('footer.links.brand') }}</NuxtLink>
        <a :href="links.demo" target="_blank" rel="noopener">{{ t('footer.links.demo') }}</a>
      </div>
      <div>
        <h3>{{ t('docs.footer_docs') }}</h3>
        <NuxtLink v-for="id in DOC_SECTIONS" :key="id" :to="localePath(sectionHome[id])">
          {{ t(`docs.sections.${id}`) }}
        </NuxtLink>
      </div>
      <div>
        <h3>{{ t('docs.footer_repos') }}</h3>
        <a v-for="repo in repos" :key="repo.key" :href="repo.href" target="_blank" rel="noopener">
          {{ t(`footer.links.${repo.key}`) }}
        </a>
      </div>
    </div>
    <p class="docs-foot-copy">© {{ year }} EasyTV · {{ t('footer.license') }}</p>
  </footer>
</template>
