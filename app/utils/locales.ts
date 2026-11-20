// 站点语种清单，nuxt.config（i18n 与预渲染路由）和语言切换菜单共用。
// code 与 easytv-web 保持一致，方便两边互相跳转。
export const DEFAULT_LOCALE = 'zh'

export const SITE_LOCALES = [
  { code: 'zh', language: 'zh-CN', name: '简体中文', file: 'zh.json' },
  { code: 'zh-tw', language: 'zh-TW', name: '繁體中文', file: 'zh-TW.json' },
  { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
  { code: 'fr', language: 'fr', name: 'Français', file: 'fr.json' },
  { code: 'ja', language: 'ja', name: '日本語', file: 'ja.json' },
  { code: 'ru', language: 'ru', name: 'Русский', file: 'ru.json' },
  { code: 'vi', language: 'vi', name: 'Tiếng Việt', file: 'vi.json' },
] as const

export type SiteLocale = typeof SITE_LOCALES[number]['code']

/** 路由前缀：默认语种不带前缀 */
export function localePrefix(code: string) {
  return code === DEFAULT_LOCALE ? '' : `/${code}`
}

/**
 * 文档正文按语种放在 content/docs/<code>/。某一页还没有译文时的取文顺序：
 * 繁体先退到简体，其它退到英文，最后兜底简体。
 */
export function contentLocales(locale: string): string[] {
  const chain = [locale, locale.startsWith('zh') ? 'zh' : 'en', 'zh']
  return [...new Set(chain)]
}
