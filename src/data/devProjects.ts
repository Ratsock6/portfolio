import type { BaseItem } from "./types";

// ⚠️ glob path en littéral obligatoire
const devMarkdownModules = import.meta.glob(
  "../content/dev/*.md",
  { as: "raw", eager: true }
) as Record<string, string>;

function buildMarkdownMap(modules: Record<string, string>) {
  const map: Record<string, string> = {};

  for (const [path, content] of Object.entries(modules)) {
    const file = path.split("/").pop() ?? "";
    const slug = file.replace(/\.md$/i, "");
    map[slug] = content;
  }

  return map;
}

const devMd = buildMarkdownMap(devMarkdownModules);

export const devProjects: BaseItem[] = [
  {
    slug: "spigot-uhc-roles",
    title: "Plugin Spigot UHC – système de rôles",
    shortDescription: "Rôles, kits, pouvoirs, cooldowns, effets jour/nuit.",
    contentMd: devMd["spigot-uhc-roles"],
    tags: ["Java", "Spigot", "Minecraft", "Architecture"],
    period: "2024 – 2026",
    role: "Conception + dev (solo)",
    highlights: [
      "Système de rôles basé sur classe abstraite",
      "Pouvoirs avec cooldowns et triggers",
      "Config YAML modulaire",
    ],
    links: [{ label: "GitHub", url: "https://github.com/" }],
    media: { image: "/projects/uhc/roles-menu.png", alt: "Menu des rôles" },
    logo: { src: "/logos/spigot.png", alt: "Spigot" },
  },
];