export default defineNuxtPlugin(() => {
  const isDark = useState('site-theme-dark', () => true)
  const dark = readStoredTheme()
  isDark.value = dark
  applyThemeClass(dark)
})
