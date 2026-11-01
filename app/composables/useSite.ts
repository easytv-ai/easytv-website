export function useSiteLinks() {
  const config = useRuntimeConfig()
  const org = config.public.githubOrg
  return {
    org,
    web: `${org}/easytv-web`,
    api: `${org}/easytv-api`,
    manage: `${org}/easytv-manage`,
    apiDoc: `${org}/easytv-api/blob/main/API.md`,
    demo: config.public.demoUrl,
  }
}

export function useTheme() {
  const isDark = useState('site-theme-dark', () => true)
  onMounted(() => {
    isDark.value = document.documentElement.classList.contains('dark')
  })
  function toggle() {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
    document.documentElement.style.colorScheme = isDark.value ? 'dark' : 'light'
    try { localStorage.setItem('easytv-site-theme', isDark.value ? 'dark' : 'light') } catch {}
  }
  return { isDark, toggle }
}
