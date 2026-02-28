import { useMemo, useState } from "react";
import { devProjects } from "../data/devProjects";
import ProjectCard from "../components/ProjectCard/ProjectCard";
import SearchBar from "../components/SearchBar/SearchBar";
import TagFilter from "../components/TagFilter/TagFilter";
import grid from "../styles/grid.module.css";

export default function DevProjects() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    devProjects.forEach((p) => p.tags.forEach((t) => s.add(t)));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return devProjects.filter((p) => {
      const matchesTag = tag ? p.tags.includes(tag) : true;
      const matchesQuery =
        q.length === 0
          ? true
          : (p.title + " " + p.shortDescription + " " + p.longDescription)
              .toLowerCase()
              .includes(q);

      return matchesTag && matchesQuery;
    });
  }, [query, tag]);

  return (
    <section>
      <h1>Projets dev perso</h1>
      <p>Mes projets de développement personnels (plugins, web, 42, etc.).</p>

      <div className={grid.toolbar}>
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Rechercher un projet..."
        />
        <TagFilter tags={allTags} selected={tag} onSelect={setTag} />
      </div>

      <div className={grid.grid}>
        {filtered.map((item) => (
          <ProjectCard key={item.slug} item={item} to={`/dev-projects/${item.slug}`} />
        ))}
      </div>

      {filtered.length === 0 && <p>Aucun projet ne correspond à ta recherche.</p>}
    </section>
  );
}