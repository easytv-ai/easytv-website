import { marked } from 'marked'
import { DOC_PAGES, parseFrontmatter, slugifyHeading, type DocPageMeta } from './docs'

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
  title: string
  description: string
  html: string
  toc: DocTocItem[]
}

function keyFor(locale: string, slug: string) {
  const suffix = `/content/docs/${locale}/${slug}.md`
  return Object.keys(sources).find(k => k.replaceAll('\\', '/').endsWith(suffix))
}

function localizeDocLinks(html: string, locale: string) {
  if (locale === 'zh') return html
  return html.replaceAll('href="/docs/', `href="/${locale}/docs/`)
}

export function loadDoc(locale: string, slug: string): RenderedDoc | null {
  const key = keyFor(locale, slug) || keyFor('zh', slug)
  if (!key) return null
  const { title, description, body } = parseFrontmatter(sources[key] || '')
  const toc: DocTocItem[] = []
  let html = marked.parse(body, { gfm: true, async: false }) as string
  html = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_m, depth: string, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, '').trim()
    const id = slugifyHeading(text)
    toc.push({ id, text, depth: Number(depth) })
    return `<h${depth} id="${id}">${inner}</h${depth}>`
  })
  html = localizeDocLinks(html, locale)
  return { slug, title, description, html, toc }
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
