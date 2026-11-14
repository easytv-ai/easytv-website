import { apiNavPages } from './api-catalog'

export type DocSection = 'start' | 'install' | 'guide' | 'api' | 'ref'

export interface DocPageMeta {
  slug: string
  section: DocSection
}

export const DOC_PAGES: DocPageMeta[] = [
  { slug: 'introduction', section: 'start' },
  { slug: 'project', section: 'start' },
  { slug: 'features', section: 'start' },
  { slug: 'architecture', section: 'start' },
  { slug: 'quickstart', section: 'start' },
  { slug: 'guide-overview', section: 'start' },
  { slug: 'compare', section: 'start' },
  { slug: 'changelog', section: 'start' },
  { slug: 'install', section: 'install' },
  { slug: 'install-docker', section: 'install' },
  { slug: 'install-source', section: 'install' },
  { slug: 'config', section: 'install' },
  { slug: 'storage', section: 'install' },
  { slug: 'deploy', section: 'install' },
  { slug: 'studio', section: 'guide' },
  { slug: 'canvas', section: 'guide' },
  { slug: 'create', section: 'guide' },
  { slug: 'director', section: 'guide' },
  { slug: 'media', section: 'guide' },
  { slug: 'billing', section: 'guide' },
  { slug: 'community', section: 'guide' },
  { slug: 'team', section: 'guide' },
  { slug: 'admin', section: 'guide' },
  { slug: 'partner', section: 'guide' },
  { slug: 'gateway', section: 'guide' },
  ...apiNavPages(),
  { slug: 'faq', section: 'ref' },
  { slug: 'license', section: 'ref' },
]

export const DOC_SECTIONS: DocSection[] = ['start', 'install', 'guide', 'api', 'ref']

export function docPath(slug: string) {
  return `/docs/${slug}`
}

export function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { title: '', description: '', body: raw.trim() }
  const fm: Record<string, string> = {}
  for (const line of (match[1] ?? '').split(/\r?\n/)) {
    const i = line.indexOf(':')
    if (i === -1) continue
    fm[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '')
  }
  return { title: fm.title || '', description: fm.description || '', body: (match[2] ?? '').trim() }
}

export function slugifyHeading(text: string) {
  return text
    .replace(/<[^>]+>/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
