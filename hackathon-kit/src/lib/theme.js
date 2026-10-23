import { useSyncExternalStore } from 'react'

export const PALETTES = ['default', 'ocean', 'forest', 'berry', 'mono']

// Theme lives on <html data-theme data-palette>, so every component shares one source of truth.
const listeners = new Set()
const root = () => document.documentElement

function set(key, value) {
  if (!value || value === 'default' || value === 'light') delete root().dataset[key]
  else root().dataset[key] = value
  try {
    localStorage.setItem(key, value)
  } catch {}
  listeners.forEach((l) => l())
}

const subscribe = (l) => (listeners.add(l), () => listeners.delete(l))
const getTheme = () => root().dataset.theme || 'light'
const getPalette = () => root().dataset.palette || 'default'

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme)
  const palette = useSyncExternalStore(subscribe, getPalette)
  return {
    theme,
    palette,
    setTheme: (t) => set('theme', t),
    setPalette: (p) => set('palette', p),
    toggleTheme: () => set('theme', getTheme() === 'dark' ? 'light' : 'dark'),
  }
}

// Read a CSS custom property, e.g. cssVar('--primary') -> '#ff4f00'
export function cssVar(name, el = document.documentElement) {
  return getComputedStyle(el).getPropertyValue(name).trim()
}
