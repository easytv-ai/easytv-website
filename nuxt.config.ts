import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'
import { DOC_PAGES } from './app/utils/docs'

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://easytv.ai'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  ssr: true,
  modules: ['@nuxtjs/i18n'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
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
    defaultLocale: 'zh',
    strategy: 'prefix_except_default',
    baseUrl: siteUrl,
    langDir: 'locales',
    locales: [
      { code: 'zh', language: 'zh-CN', name: '简体中文', file: 'zh.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
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
      routes: [
        '/',
        '/en',
        '/docs',
        '/en/docs',
        ...DOC_PAGES.flatMap(p => [`/docs/${p.slug}`, `/en/docs/${p.slug}`]),
      ],
    },
  },
})
