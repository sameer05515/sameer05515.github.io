import { projects } from "./projects.js";

const linkIcons = {
  live: "🔗",
  repo: "📂",
  default: "➡️",
};

const badgeClasses =
  "inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-0.5 text-xs font-semibold text-primary dark:border-accent/20 dark:bg-accent/5 dark:text-accent";

const linkClasses =
  "inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:text-accent";

export function renderProjects(containerId = "projectsGrid") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const fragment = document.createDocumentFragment();

  projects.forEach((project) => {
    const card = document.createElement("article");
    card.className =
      "group flex flex-col rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow dark:border-slate-800 dark:bg-slate-900/70";

    const badge = project.badge
      ? `<span class="${badgeClasses}">${project.badge}</span>`
      : "";

    card.innerHTML = `
      <div class="flex items-center justify-between gap-2">
        <h4 class="text-xl font-semibold text-slate-800 dark:text-white">${project.title}</h4>
        ${badge}
      </div>
      <p class="mt-3 flex-1 text-sm text-slate-600 dark:text-slate-300">
        ${project.description}
      </p>
      <div class="mt-6 flex flex-wrap gap-4">
        ${renderLinks(project.links)}
      </div>
    `;

    fragment.appendChild(card);
  });

  container.replaceChildren(fragment);
}

function renderLinks(links = []) {
  if (!links.length) return "";
  return links
    .map((link) => {
      const icon = linkIcons[link.type] || linkIcons.default;
      return `
        <a
          href="${link.url}"
          target="_blank"
          rel="noreferrer"
          class="${linkClasses}"
        >
          <span aria-hidden="true">${icon}</span>
          ${link.label}
        </a>
      `;
    })
    .join("");
}

