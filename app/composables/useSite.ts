export function useSiteLinks() {
  const config = useRuntimeConfig()
  const org = config.public.githubOrg
  return {
    org,
    web: `${org}/easytv-web`,
    api: `${org}/easytv-api`,
    manage: `${org}/easytv-manage`,
    partner: `${org}/easytv-partner`,
    apiDoc: `${org}/easytv-api/blob/main/API.md`,
    demo: config.public.demoUrl,
  }
}

const THEME_KEY = 'easytv-site-theme'

export function readStoredTheme(): boolean {
  if (!import.meta.client) return true
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'light') return false
    if (stored === 'dark') return true
  } catch {}
  return document.documentElement.classList.contains('dark')
}

export function applyThemeClass(dark: boolean) {
  if (!import.meta.client) return
  document.documentElement.classList.toggle('dark', dark)
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
}

export function useTheme() {
  const isDark = useState('site-theme-dark', () => true)

  function apply(dark: boolean, persist = true) {
    isDark.value = dark
    applyThemeClass(dark)
    if (persist && import.meta.client) {
      try { localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light') } catch {}
    }
  }

  function toggle() {
    apply(!isDark.value)
  }

  return { isDark, toggle, apply }
}
