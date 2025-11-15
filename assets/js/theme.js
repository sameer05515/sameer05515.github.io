const THEME_STORAGE_KEY = "preferred-theme";
const DARK_CLASS = "dark";

export function initThemeToggle(buttonSelector = "[data-theme-toggle]") {
  const toggleButton = document.querySelector(buttonSelector);
  if (!toggleButton) return;

  const initialTheme = getInitialTheme();
  applyTheme(initialTheme, toggleButton);

  toggleButton.addEventListener("click", () => {
    const nextTheme = document.documentElement.classList.contains(DARK_CLASS)
      ? "light"
      : "dark";
    applyTheme(nextTheme, toggleButton);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  });
}

function getInitialTheme() {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme) {
    return storedTheme;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

function applyTheme(theme, button) {
  document.documentElement.classList.toggle(DARK_CLASS, theme === "dark");
  const label = button.querySelector("[data-theme-label]");
  if (label) {
    label.textContent = theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
  }
}

