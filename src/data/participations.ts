import type { BaseItem } from "./types";

const partMarkdownModules = import.meta.glob(
  "../content/participations/*.md",
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

const partMd = buildMarkdownMap(partMarkdownModules);

export const participations: BaseItem[] = [
  {
    slug: "service-civique-education",
    title: "Engagement – accompagnement / éducation",
    shortDescription: "Activités d’encadrement et projets éducatifs.",
    contentMd: partMd["service-civique-education"],
    tags: ["Encadrement", "Pédagogie", "Organisation"],
    period: "2025 – 2026",
    role: "Encadrement + création supports",
    highlights: ["Création de supports", "Animation de groupe", "Organisation"],
  },
];