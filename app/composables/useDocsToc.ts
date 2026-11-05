import type { DocTocItem } from '~/utils/docs-render'

export function useDocsToc() {
  return useState<DocTocItem[]>('docs-toc', () => [])
}
