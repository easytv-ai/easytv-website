import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'
import { apiGroupRedirects } from './app/utils/api-catalog'
import { DOC_PAGES } from './app/utils/docs'
import { DEFAULT_LOCALE, SITE_LOCALES, localePrefix } from './app/utils/locales'

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://easytv.ai'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  ssr: true,
  modules: ['@nuxtjs/i18n', '@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
    // marked 只在文档页用到，不预打包的话首次进文档会整页重载
    optimizeDeps: { include: ['marked'] },
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap' },
      ],
      script: [
        {
          // 主题：跟首页同一套。未选过默认暗色，选过则听 localStorage，避免文档页把浅色盖回去
          innerHTML: `(function(){try{var s=localStorage.getItem('easytv-site-theme');var d=s?s==='dark':true;document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}})();`,
          tagPosition: 'head',
        },
      ],
    },
  },
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    strategy: 'prefix_except_default',
    baseUrl: siteUrl,
    langDir: 'locales',
    locales: SITE_LOCALES.map(l => ({ ...l })),
    detectBrowserLanguage: false,
  },
  runtimeConfig: {
    public: {
      siteUrl,
      githubOrg: 'https://github.com/easytv-ai',
      demoUrl: process.env.NUXT_PUBLIC_DEMO_URL || 'https://www.easytv.ai',
    },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/sitemap.xml', '/robots.txt', ...SITE_LOCALES.flatMap((l) => {
        const prefix = localePrefix(l.code)
        return [
          prefix || '/',
          `${prefix}/docs`,
          ...DOC_PAGES.map(p => `${prefix}/docs/${p.slug}`),
        ]
      })],
    },
  },
  routeRules: Object.fromEntries(
    apiGroupRedirects().map(r => [r.from, { redirect: { to: r.to, statusCode: 301 } }]),
  ),
})
