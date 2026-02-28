export type Theme = "dark" | "light";

const STORAGE_KEY = "portfolio_theme";

export function getStoredTheme(): Theme | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === "dark" || raw === "light") return raw;
  return null;
}

export function setStoredTheme(theme: Theme) {
  localStorage.setItem(STORAGE_KEY, theme);
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}