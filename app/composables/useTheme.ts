export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'magies-theme'

/**
 * main.css ships a full light palette under :root[data-theme="light"]; the layout
 * used to force dark and wipe the stored preference, so none of it was reachable.
 */
export function useTheme() {
  const theme = useState<Theme>('magies-theme', () => 'dark')

  function applyTheme(next: Theme) {
    theme.value = next
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', next)
      localStorage.setItem(STORAGE_KEY, next)
    }
  }

  function toggleTheme() {
    applyTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  /**
   * The inline head script has already set data-theme before first paint; this
   * only syncs the reactive copy so components can branch on it.
   */
  function initTheme() {
    if (!import.meta.client) return
    const attr = document.documentElement.getAttribute('data-theme') as Theme | null
    theme.value = attr === 'light' ? 'light' : 'dark'
  }

  return { theme, toggleTheme, initTheme }
}
