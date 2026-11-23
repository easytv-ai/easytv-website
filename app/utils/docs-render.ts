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
      return `<h${depth} id="${id}"><a href="#${id}"><span class="docs-method is-${verb.toLowerCase()}">${verb}</span><code class="docs-ep-path">${route}</code></a></h${depth}>`
    },
  )
  html = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_m, depth: string, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, '').trim()
    const id = slugifyHeading(text)
    toc.push({ id, text, depth: Number(depth) })
    return `<h${depth} id="${id}"><a href="#${id}">${inner}</a></h${depth}>`
  })
  html = html.replace(/<pre><code([^>]*)>([\s\S]*?)<\/code><\/pre>/g, (_m, attrs: string, inner: string) => {
    const lang = /language-([\w+-]+)/.exec(attrs)?.[1] || 'text'
    return `<figure class="docs-code" data-lang="${lang}"><button type="button" class="docs-pre-copy" aria-label="Copy"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="5" width="8" height="9" rx="1.4"/><path d="M11 5V3.6A1.6 1.6 0 0 0 9.4 2H3.6A1.6 1.6 0 0 0 2 3.6v7.8A1.6 1.6 0 0 0 3.6 13H5"/></svg></button><pre><code${attrs}>${inner}</code></pre></figure>`
  })
  html = html.replace(/<blockquote>([\s\S]*?)<\/blockquote>/g, (_m, inner: string) => {
    const plain = inner.replace(/<[^>]+>/g, '')
    const type = /警告|危险|错误|error/i.test(plain) ? 'error' : /注意|warn/i.test(plain) ? 'warning' : 'info'
    const icon = type === 'error'
      ? '<circle cx="12" cy="12" r="9"/><path d="m15 9-6 6M9 9l6 6" stroke="var(--fd-card)" stroke-width="1.6" fill="none"/>'
      : type === 'warning'
        ? '<path d="M12 3.5 2.8 19.5h18.4L12 3.5Z"/><path d="M12 9v4.5" stroke="var(--fd-card)" stroke-width="1.6" fill="none"/><circle cx="12" cy="16.2" r="0.8" fill="var(--fd-card)"/>'
        : '<circle cx="12" cy="12" r="9"/><path d="M12 11v5" stroke="var(--fd-card)" stroke-width="1.6" fill="none"/><circle cx="12" cy="8" r="0.8" fill="var(--fd-card)"/>'
    return `<div class="docs-callout" data-type="${type}"><span class="docs-callout-bar" aria-hidden="true"></span><svg class="docs-callout-icon" viewBox="0 0 24 24" aria-hidden="true">${icon}</svg><div class="docs-callout-body">${inner}</div></div>`
  })
  html = html.replace(/<table>/g, '<div class="docs-table"><table>').replace(/<\/table>/g, '</table></div>')
  if (slug === 'faq') html = wrapFaq(html)
  html = localizeDocLinks(html, locale)
  return { slug, sourceLocale, title, description, html, toc }
}

const CODE_LANG: Record<string, string> = {
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  bash: 'bash',
  json: 'json',
  jsonc: 'json',
  nginx: 'nginx',
  conf: 'nginx',
  ini: 'ini',
  toml: 'ini',
  text: 'plaintext',
  txt: 'plaintext',
}

function decodeHtml(text: string) {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(Number.parseInt(n, 16)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
}

type DocsHighlighter = {
  codeToHtml: (code: string, options: {
    lang: string
    themes: { light: string, dark: string }
    defaultColor: false
  }) => string
}

let highlighterTask: Promise<DocsHighlighter> | null = null

function docsHighlighter() {
  highlighterTask ??= (async () => {
    const { createHighlighter } = await import('shiki')
    const { createJavaScriptRegexEngine } = await import('shiki/engine/javascript')
    return createHighlighter({
      engine: createJavaScriptRegexEngine(),
      themes: ['github-light', 'github-dark'],
      langs: ['bash', 'json', 'nginx', 'ini', 'plaintext'],
    })
  })()
  return highlighterTask
}

/** 给代码块上 github-light / github-dark 双色，和 New API 文档同一套。 */
export async function highlightCode(code: string, lang: string) {
  const hl = await docsHighlighter()
  const used = CODE_LANG[lang] || 'plaintext'
  return hl.codeToHtml(code.replace(/\n$/, ''), {
    lang: used,
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
  })
}

function wrapFaq(html: string) {
  const parts = html.split(/(?=<h2[\s>])/)
  const intro = parts[0]?.startsWith('<h2') ? '' : (parts.shift() || '')
  const items = parts.map((part) => {
    const match = part.match(/^<h2 id="([^"]+)">([\s\S]*?)<\/h2>([\s\S]*)$/)
    if (!match) return part
    const title = (match[2] || '').replace(/<a [^>]*>([\s\S]*?)<\/a>/, '$1')
    return `<details id="${match[1]}" class="docs-acc"><summary>${title}</summary><div class="docs-acc-body">${match[3] || ''}</div></details>`
  }).join('')
  if (!items) return html
  return `${intro}<div class="docs-acc-list">${items}</div>`
}

export async function highlightDocHtml(html: string) {
  if (!html.includes('class="docs-code"')) return html
  try {
    return await highlightDocHtmlInner(html)
  }
  catch {
    return html
  }
}

async function highlightDocHtmlInner(html: string) {
  const pattern = /<figure class="docs-code" data-lang="([^"]*)">([\s\S]*?)<\/figure>/g
  let out = ''
  let cursor = 0
  for (const match of html.matchAll(pattern)) {
    const full = match[0]
    const index = match.index ?? 0
    out += html.slice(cursor, index)
    cursor = index + full.length
    const lang = match[1] || 'text'
    const inner = match[2] || ''
    const code = inner.match(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/)?.[1]
    const button = inner.match(/<button[\s\S]*?<\/button>/)?.[0] || ''
    if (code == null) {
      out += full
      continue
    }
    try {
      const pre = await highlightCode(decodeHtml(code), lang)
      out += `<figure class="docs-code" data-lang="${lang}">${button}${pre}</figure>`
    }
    catch {
      out += full
    }
  }
  return out + html.slice(cursor)
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
