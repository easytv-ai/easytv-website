import { marked } from 'marked'
import { DOC_PAGES, parseFrontmatter, slugifyHeading, type DocPageMeta } from './docs'
import { DEFAULT_LOCALE, contentLocales } from './locales'

// 目录名即语种 code；新增译文只要放进 content/docs/<code>/ 就会被读到
const sources = import.meta.glob('../../content/docs/*/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export interface DocTocItem {
  id: string
  text: string
  depth: number
}

export interface RenderedDoc {
  slug: string
  /** 正文实际来自哪个语种目录；与当前语种不同说明是退回的原文 */
  sourceLocale: string
  title: string
  description: string
  html: string
  toc: DocTocItem[]
}

function keyFor(locale: string, slug: string) {
  const suffix = `/content/docs/${locale}/${slug}.md`
  return Object.keys(sources).find(k => k.replaceAll('\\', '/').endsWith(suffix))
}

/** 按退回顺序找到第一份存在的原文 */
function resolveSource(locale: string, slug: string) {
  for (const code of contentLocales(locale)) {
    const key = keyFor(code, slug)
    if (key) return { key, sourceLocale: code }
  }
  return null
}

function localizeDocLinks(html: string, locale: string) {
  if (locale === DEFAULT_LOCALE) return html
  return html.replaceAll('href="/docs/', `href="/${locale}/docs/`)
}

export function loadDocSource(locale: string, slug: string): string | null {
  const key = resolveSource(locale, slug)?.key
  if (!key) return null
  const { title, description, body } = parseFrontmatter(sources[key] || '')
  const parts = [`# ${title}`]
  if (description) parts.push('', description)
  if (body) parts.push('', body)
  return `${parts.join('\n').trim()}\n`
}

export function loadDoc(locale: string, slug: string): RenderedDoc | null {
  const found = resolveSource(locale, slug)
  if (!found) return null
  const { key, sourceLocale } = found
  const { title, description, body } = parseFrontmatter(sources[key] || '')
  const toc: DocTocItem[] = []
  let html = marked.parse(body, { gfm: true, async: false }) as string
  html = html.replace(
    /<h([23])>(GET|POST|PUT|DELETE|PATCH)\s+(?:<code>)?([^<]+?)(?:<\/code>)?<\/h\1>/gi,
    (_m, depth: string, method: string, path: string) => {
      const verb = method.toUpperCase()
      const route = path.trim()
      const text = `${verb} ${route}`
      const id = slugifyHeading(text)
      toc.push({ id, text, depth: Number(depth) })
      return `<h${depth} id="${id}"><span class="docs-method is-${verb.toLowerCase()}">${verb}</span><code class="docs-ep-path">${route}</code></h${depth}>`
    },
  )
  html = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_m, depth: string, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, '').trim()
    const id = slugifyHeading(text)
    toc.push({ id, text, depth: Number(depth) })
    return `<h${depth} id="${id}">${inner}</h${depth}>`
  })
  html = localizeDocLinks(html, locale)
  return { slug, sourceLocale, title, description, html, toc }
}

export function loadDocNav(locale: string) {
  return DOC_PAGES.map((page: DocPageMeta) => {
    const doc = loadDoc(locale, page.slug)
    return {
      ...page,
      title: doc?.title || page.slug,
      description: doc?.description || '',
    }
  })
}

export function neighbors(slug: string) {
  const i = DOC_PAGES.findIndex(p => p.slug === slug)
  return {
    prev: i > 0 ? DOC_PAGES[i - 1] : null,
    next: i >= 0 && i < DOC_PAGES.length - 1 ? DOC_PAGES[i + 1] : null,
  }
}
