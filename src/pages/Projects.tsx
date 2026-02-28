import { useMemo, useState } from "react";
import { participations } from "../data/participations";
import ProjectCard from "../components/ProjectCard/ProjectCard";
import SearchBar from "../components/SearchBar/SearchBar";
import TagFilter from "../components/TagFilter/TagFilter";
import grid from "../styles/grid.module.css";

export default function Projects() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    participations.forEach((p) => p.tags.forEach((t) => s.add(t)));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return participations.filter((p) => {
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
      <h1>Projets</h1>
      <p>Participations (pas forcément dev ni pro) : associatif, scolaire, événements…</p>

      <div className={grid.toolbar}>
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Rechercher une participation..."
        />
        <TagFilter tags={allTags} selected={tag} onSelect={setTag} />
      </div>

      <div className={grid.grid}>
        {filtered.map((item) => (
          <ProjectCard key={item.slug} item={item} to={`/projects/${item.slug}`} />
        ))}
      </div>

      {filtered.length === 0 && <p>Aucune participation ne correspond à ta recherche.</p>}
    </section>
  );
}