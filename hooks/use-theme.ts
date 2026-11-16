import * as React from "react"

/**
 * Framework-free theme reader: "dark" when <html> has the `dark` class, otherwise "light".
 * Follows class changes made by any theme switcher (next-themes, a Laravel/Inertia toggle, plain JS).
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
  return () => observer.disconnect()
}

export function useTheme(): "light" | "dark" {
  return React.useSyncExternalStore(
    subscribe,
    () => (document.documentElement.classList.contains("dark") ? "dark" : "light"),
    () => "light"
  )
}
