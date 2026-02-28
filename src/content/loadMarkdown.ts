// Charge tous les markdowns et renvoie un dictionnaire { slug: content }
export function loadMarkdownMap(globPath: string): Record<string, string> {
  // Vite: eager + raw => string directement
  const modules = import.meta.glob(globPath, { as: "raw", eager: true }) as Record<
    string,
    string
  >;

  const map: Record<string, string> = {};

  for (const [path, content] of Object.entries(modules)) {
    // Ex: "../content/dev/spigot-uhc-roles.md" => "spigot-uhc-roles"
    const file = path.split("/").pop() ?? "";
    const slug = file.replace(/\.md$/i, "");
    map[slug] = content;
  }

  return map;
}