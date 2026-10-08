import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext(null)
const THEME_KEY = 'veyra-theme'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  const saved = localStorage.getItem(THEME_KEY)
  return saved === 'dark' || saved === 'light' ? saved : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])
  const value = useMemo(() => ({ theme, setTheme, toggleTheme: () => setTheme((current) => current === 'light' ? 'dark' : 'light') }), [theme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside ThemeProvider')
  return context
}
