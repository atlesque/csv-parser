type ColorMode = 'light' | 'dark' | 'auto'

const STORAGE_KEY = 'csv-parser-color-mode'

declare global {
  interface Window {
    __CSV_COLOR_MODE__?: ColorMode
  }
}

// Read the initial mode set by the blocking head script (no flash).
// Falls back to 'auto' on server or if the script didn't run.
function getInitialMode(): ColorMode {
  if (import.meta.server) return 'auto'
  return window.__CSV_COLOR_MODE__ ?? 'auto'
}

const mode = ref<ColorMode>(getInitialMode())
let initialized = false

function applyMode(m: ColorMode) {
  if (import.meta.server) return
  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const isDark = m === 'dark' || (m === 'auto' && darkQuery.matches)
  document.documentElement.classList.toggle('dark', isDark)
}

export function useDarkMode() {
  if (import.meta.server) {
    return { mode: ref<ColorMode>('auto'), cycle: () => {} }
  }

  if (!initialized) {
    initialized = true

    // Listen for system preference changes while in auto mode
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
    darkQuery.addEventListener('change', () => {
      if (mode.value === 'auto') {
        applyMode('auto')
      }
    })

    // Persist changes
    watch(mode, (newMode) => {
      localStorage.setItem(STORAGE_KEY, newMode)
      applyMode(newMode)
    })
  }

  function cycle() {
    const modes: ColorMode[] = ['light', 'dark', 'auto']
    const idx = modes.indexOf(mode.value)
    mode.value = modes[(idx + 1) % modes.length]
  }

  return { mode, cycle }
}
