import { initThemeToggle } from "./theme.js";
import { renderProjects } from "./renderProjects.js";

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  renderProjects();
});

