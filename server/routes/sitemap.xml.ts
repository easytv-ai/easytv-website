import { DOC_PAGES } from '../../app/utils/docs'
import { SITE_LOCALES, localePrefix } from '../../app/utils/locales'

// 构建时预渲染成静态文件。每个地址带上全部语种的 hreflang 互指。
export default defineEventHandler((event) => {
  const site = String(useRuntimeConfig(event).public.siteUrl).replace(/\/$/, '')
  const paths = ['', '/docs', '/brand', ...DOC_PAGES.map(p => `/docs/${p.slug}`)]
  const loc = (code: string, path: string) => `${site}${localePrefix(code)}${path}` || site

  const urls = paths.flatMap(path => SITE_LOCALES.map((l) => {
    const alternates = SITE_LOCALES
      .map(a => `    <xhtml:link rel="alternate" hreflang="${a.language}" href="${loc(a.code, path)}"/>`)
      .join('\n')
    return `  <url>\n    <loc>${loc(l.code, path)}</loc>\n${alternates}\n  </url>`
  }))

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`
})
