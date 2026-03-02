export type TimelineItem = {
  id: string;
  start: string; // "2023" ou "2023-09"
  end?: string;  // optionnel (si en cours)
  title: string; // ex: "École 42 — Le Havre"
  subtitle?: string; // ex: "Formation informatique"
  kind: "Études" | "Travail" | "Projet" | "Bénévolat";
  location?: string;
  bullets?: string[];
  tags?: string[];
  logo?: string;
};

export const timeline: TimelineItem[] = [
  {
    id: "java-start",
    start: "2019",
    title: "Début en autodidacte (Java / Skript)",
    kind: "Projet",
    bullets: ["Premiers projets perso", "Découverte de la logique et de l'architecture"],
    tags: ["Java"],
    logo: "/logos/spigot.png"
  },
  {
    id: "sti2d",
    start: "2020",
    end: "2022",
    title: "Bac STI2D — spécialité SIN",
    kind: "Études",
    bullets: ["Programmation, systèmes, bases web", "Projets techniques en groupe"],
    tags: ["Python", "Web", "Systèmes", "C", "Arduino"],
    logo: "/logos/spigot.png"
  },
  {
    id: "industrial-6m",
    start: "Janvier 2023",
    end: "Juin 2023",
    title: "Assistant informatique industriel - Procter & Gamble",
    kind: "Travail",
    bullets: ["Gestion des imprimantes du site", ""],
    tags: ["Industrie", "Réseaux"],
    logo: "/logos/spigot.png"
  },
  {
    id: "42",
    start: "Juillet 2023",
    title: "École 42 — Le Havre",
    kind: "Études",
    bullets: ["Projets en C / algo / système", "Montée en autonomie et rigueur"],
    tags: ["C", "Linux", "Git", "C++", "Docker", "..."],
    logo: "/logos/spigot.png"
  },
  {
    id: "paragon-studio",
    start: "Janvier 2024",
    title: "Paragon Studio",
    kind: "Projet",
    bullets: ["Création du mini ESN pour des plugins minecraft orienté UHC"],
    tags: ["Java", "Spigot"],
    logo: "/logos/spigot.png"
  },
  {
    id: "Unis Cité",
    start: "Octobre 2024",
    title: "Unis Cité",
    kind: "Travail",
    bullets: ["Service civique", "Apprentisage de la programation pour les enfants"],
    tags: ["Scratch", "Arduino", "Logique"],
    logo: "/logos/spigot.png"
  },
  {
    id: "supervision",
    start: "Septembre 2025",
    title: "Encadrement / vie scolaire (surveillant)",
    kind: "Travail",
    bullets: ["Gestion de groupe", "Création de supports et organisation"],
    tags: ["Pédagogie", "Organisation"],
    logo: "/logos/spigot.png"
  },
];