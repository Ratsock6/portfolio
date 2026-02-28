import { useEffect, useMemo, useState } from "react";
import type { Theme } from "./theme";
import { applyTheme, getStoredTheme, setStoredTheme } from "./theme";

function getSystemTheme(): Theme {
  return window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function useTheme() {
  const initial = useMemo<Theme>(() => {
    const stored = getStoredTheme();
    return stored ?? getSystemTheme();
  }, []);

  const [theme, setTheme] = useState<Theme>(initial);

  useEffect(() => {
    applyTheme(theme);
    setStoredTheme(theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  return { theme, setTheme, toggleTheme };
}