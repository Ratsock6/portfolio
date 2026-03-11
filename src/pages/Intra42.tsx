import { useEffect, useMemo, useState } from "react";
import styles from "../styles/intra42.module.css";

type Api42Response = {
  profile?: {
    login?: string;
    usual_full_name?: string;
    displayname?: string;
    pool_month?: string;
    pool_year?: string;
    created_at?: string;
    wallet?: number;
    correction_point?: number;
    cursus_users?: Array<{
      level?: number;
      skills?: Array<{
        name?: string;
        level?: number;
      }>;
      cursus?: {
        id?: number;
        name?: string;
      };
    }>;
    projects_users?: Array<{
      status?: string;
      final_mark?: number | null;
      validated?: boolean | null;
      marked_at?: string | null;
      created_at?: string | null;
      project?: {
        name?: string;
      };
    }>;
    achievements?: Array<{
      id?: number;
      name?: string;
      description?: string;
      kind?: string;
      tier?: string;
      nbr_of_success?: number;
      visible?: boolean;
      created_at?: string | null;
      updated_at?: string | null;
      image?: string;
    }>;
    titles_users?: Array<{
      selected?: boolean;
      created_at?: string | null;
      title?: {
        id?: number;
        name?: string;
      };
    }>;
  };
};

type Skill = {
  name: string;
  level: number;
};

type Project = {
  name: string;
  final_mark: number | null;
  validated: boolean;
  date: string | null;
  timestamp: number;
};

function formatDate(dateString?: string | null) {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getDisplayName(profile: Api42Response["profile"]) {
  return (
    profile?.usual_full_name ||
    profile?.displayname ||
    profile?.login ||
    "Profil 42"
  );
}

function getPool(profile: Api42Response["profile"]) {
  if (!profile?.pool_month && !profile?.pool_year) return "-";
  return `${profile?.pool_month ?? ""} ${profile?.pool_year ?? ""}`.trim();
}

function getMainCursus(profile: Api42Response["profile"]) {
  const cursus = profile?.cursus_users ?? [];
  if (!cursus.length) return null;

  return (
    cursus.find((c) => c.cursus?.name?.toLowerCase().includes("42")) ||
    cursus[0]
  );
}

function getXpPercent(level: number) {
  const decimal = level % 1;
  return Math.round(decimal * 100);
}

function getSkillPercent(level: number, max = 12) {
  return Math.max(0, Math.min((level / max) * 100, 100));
}

type TimelineItem = {
  id: string;
  type: "account" | "pool" | "project" | "achievement" | "title";
  title: string;
  subtitle?: string;
  date: string | null;
  timestamp: number;
  status?: "validated" | "failed" | "info";
};

function getTimestamp(dateString?: string | null) {
  if (!dateString) return 0;
  const ts = new Date(dateString).getTime();
  return Number.isNaN(ts) ? 0 : ts;
}

function formatPoolDate(profile: Api42Response["profile"]) {
  if (!profile?.pool_month && !profile?.pool_year) return null;

  return `${profile.pool_month ?? ""} ${profile.pool_year ?? ""}`.trim();
}

export default function Intra42Page() {
  const [data, setData] = useState<Api42Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      try {
        setLoading(true);
        setError(null);

        const d = await fetch("/api/42").then((r) => {
          if (!r.ok) {
            throw new Error(`HTTP ${r.status}`);
          }
          return r.json();
        });

        setData(d);
      } catch (e) {
        console.error("42 load failed", e);
        setError("Impossible de charger les données 42.");
      } finally {
        setLoading(false);
      }
    }

    run();
  }, []);

  const profile = data?.profile ?? undefined;

  const mainCursus = useMemo(() => getMainCursus(profile), [profile]);

  const level = mainCursus?.level ?? 0;
  const currentLevel = Math.floor(level);
  const xpPercent = getXpPercent(level);
  const nextLevel = currentLevel + 1;

  const skills = useMemo<Skill[]>(() => {
    const rawSkills = mainCursus?.skills ?? [];

    return rawSkills
      .filter((skill) => skill?.name && typeof skill?.level === "number")
      .map((skill) => ({
        name: skill.name as string,
        level: skill.level as number,
      }))
      .sort((a, b) => b.level - a.level)
      .slice(0, 5);
  }, [mainCursus]);

  const latestProjects = useMemo<Project[]>(() => {
    const rawProjects = profile?.projects_users ?? [];
    const seen = new Set<string>();

    return rawProjects
      .filter((project) => project?.project?.name)
      .filter((project) => project.status === "finished" || project.marked_at)
      .map((project) => {
        const name = project.project?.name ?? "Projet inconnu";
        const validated =
          project.validated === true ||
          (typeof project.final_mark === "number" && project.final_mark >= 50);

        const timestamp = project.marked_at
          ? new Date(project.marked_at).getTime()
          : 0;

        return {
          name,
          final_mark: project.final_mark ?? null,
          validated,
          date: project.marked_at ?? null,
          timestamp: Number.isNaN(timestamp) ? 0 : timestamp,
        };
      })
      .sort((a, b) => b.timestamp - a.timestamp)
      .filter((project) => {
        if (seen.has(project.name)) return false;
        seen.add(project.name);
        return true;
      })
      .slice(0, 8);
  }, [profile]);

  const validatedProjectsCount = useMemo(() => {
    const rawProjects = profile?.projects_users ?? [];
    const seen = new Set<string>();

    return rawProjects.reduce((count, project) => {
      const name = project?.project?.name;
      if (!name || seen.has(name)) return count;

      const validated =
        project.validated === true ||
        (typeof project.final_mark === "number" && project.final_mark >= 50);

      if (validated) {
        seen.add(name);
        return count + 1;
      }

      return count;
    }, 0);
  }, [profile]);

  const achievements = useMemo(() => {
  const rawAchievements = profile?.achievements ?? [];

  return rawAchievements
    .filter((achievement) => achievement?.name)
    .map((achievement) => ({
      id: achievement.id ?? Math.random(),
      name: achievement.name ?? "Achievement",
      description: achievement.description ?? "",
      tier: achievement.tier ?? "",
      kind: achievement.kind ?? "",
      image: achievement.image ?? "",
      count: achievement.nbr_of_success ?? 0,
      visible: achievement.visible ?? true,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [profile]);

  const achievementsCount = achievements.length;


  const titles = useMemo(() => {
    if (!profile?.titles_users) return [];

    return profile.titles_users
      .filter((titleUser) => titleUser.title?.name)
      .map((titleUser) => ({
        id: titleUser.title?.id ?? crypto.randomUUID(),
        name: (titleUser.title?.name ?? "Sans titre").replace(
          "%login",
          profile.login ?? "user"
        ),
        created_at: titleUser.created_at ?? null,
        selected: titleUser.selected ?? false,
      }));
  }, [profile]);


  const timeline = useMemo<TimelineItem[]>(() => {
  if (!profile) return [];

  const items: TimelineItem[] = [];

  if (profile.created_at) {
    items.push({
      id: `account-${profile.created_at}`,
      type: "account",
      title: "Création du compte 42",
      subtitle: "Début du parcours sur l’intra",
      date: profile.created_at,
      timestamp: getTimestamp(profile.created_at),
      status: "info",
    });
  }

  const poolLabel = formatPoolDate(profile);
  if (poolLabel) {
    items.push({
      id: `pool-${poolLabel}`,
      type: "pool",
      title: `Piscine ${poolLabel}`,
      subtitle: "Entrée dans l’écosystème 42",
      date: profile.created_at ?? null,
      timestamp: getTimestamp(profile.created_at),
      status: "info",
    });
  }

  const seenProjects = new Set<string>();
  (profile.projects_users ?? [])
    .filter((project) => project?.project?.name)
    .filter((project) => project.marked_at || project.created_at)
    .sort((a, b) => getTimestamp(b.marked_at ?? b.created_at) - getTimestamp(a.marked_at ?? a.created_at))
    .forEach((project) => {
      const projectName = project.project?.name ?? "Projet inconnu";
      if (seenProjects.has(projectName)) return;
      seenProjects.add(projectName);

      const validated =
        project.validated === true ||
        (typeof project.final_mark === "number" && project.final_mark >= 50);

      const date = project.marked_at ?? project.created_at ?? null;

      items.push({
        id: `project-${projectName}-${date ?? "unknown"}`,
        type: "project",
        title: projectName,
        subtitle:
          typeof project.final_mark === "number"
            ? `Projet rendu • Note ${project.final_mark}`
            : "Projet non rendu",
        date,
        timestamp: getTimestamp(date),
        status: validated ? "validated" : "failed",
      });
    });

  (profile.achievements ?? [])
    .filter((achievement) => achievement?.name)
    .filter((achievement) => (achievement.nbr_of_success ?? 0) > 0)
    .forEach((achievement) => {
      const date = achievement.updated_at ?? achievement.created_at ?? null;

      items.push({
        id: `achievement-${achievement.id ?? achievement.name}`,
        type: "achievement",
        title: achievement.name ?? "Achievement",
        subtitle: achievement.description || achievement.kind || "Achievement débloqué",
        date,
        timestamp: getTimestamp(date),
        status: "info",
      });
    });

  titles.forEach((title) => {
    items.push({
      id: `title-${title.id}`,
      type: "title",
      title: title.name,
      subtitle: "Titre débloqué",
      date: title.created_at ?? null,
      timestamp: getTimestamp(title.created_at),
      status: title.selected ? "validated" : "info",
    });
  });

  return items
    .sort((a, b) => b.timestamp - a.timestamp)
}, [profile, titles]);

  console.log("Profile data:", titles);

  if (loading) {
    return <div className={styles.intra42State}>Chargement du profil 42...</div>;
  }

  if (error) {
    return <div className={styles.intra42State}>{error}</div>;
  }

  if (!profile) {
    return <div className={styles.intra42State}>Profil 42 introuvable.</div>;
  }

  return (
    <div className={styles.intra42Page}>
      <div className={styles.intra42Grid}>
        <section className={styles.heroCard}>
          <div className={styles.heroBadge}>42 PROFILE</div>

          <h1>{getDisplayName(profile)}</h1>
          <p className={styles.heroLogin}>@{profile.login ?? "-"}</p>

          <p className={styles.heroDescription}>
            Profil 42. Découvre mon parcours, mes compétences, et ma progression à l'école 42.
          </p>

          <div className={styles.heroMeta}>
            <div>
              <span className={styles.label}>Piscine</span>
              <span className={styles.value}>{getPool(profile)}</span>
            </div>

            <div>
              <span className={styles.label}>Compte créé</span>
              <span className={styles.value}>{formatDate(profile.created_at)}</span>
            </div>

            <div>
              <span className={styles.label}>Cursus</span>
              <span className={styles.value}>{mainCursus?.cursus?.name ?? "-"}</span>
            </div>
          </div>
        </section>

        <section className={styles.xpCard}>
          <div className={styles.sectionHead}>
            <h2>Progression</h2>
            <span className={styles.chip}>Level {level.toFixed(2)}</span>
          </div>

          <div className={styles.xpHeader}>
            <span>Level {currentLevel}</span>
            <span>{xpPercent}%</span>
            <span>Level {nextLevel}</span>
          </div>

          <div className={styles.xpBar}>
            <div
              className={styles.xpBarFill}
              style={{ width: `${xpPercent}%` }}
            />
          </div>

          <p className={styles.xpCaption}>
            Progression actuelle vers le niveau <strong>{nextLevel}</strong> :
            <strong> {xpPercent}%</strong>.
          </p>
        </section>

        <section className={styles.statsCard}>
          <div className={styles.sectionHead}>
            <h2>Stats clés</h2>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>Projets validés</span>
              <strong>{validatedProjectsCount}</strong>
            </div>

            <div className={styles.statBox}>
              <span className={styles.statLabel}>Wallet</span>
              <strong>{profile.wallet ?? 0} ₳</strong>
            </div>

            <div className={styles.statBox}>
              <span className={styles.statLabel}>Correction points</span>
              <strong>{profile.correction_point ?? 0}</strong>
            </div>

            <div className={styles.statBox}>
              <span className={styles.statLabel}>Niveau actuel</span>
              <strong>{level.toFixed(2)}</strong>
            </div>
          </div>
        </section>

        <section className={styles.titlesCard}>
            <div className={styles.sectionHead}>
                <h2>Titles</h2>
                <span className={styles.chip}>{titles.length}</span>
            </div>

            {titles.length > 0 ? (
                <div className={styles.titlesGrid}>
                {titles.map((title) => (
                    <div
                    key={title.id}
                    className={`${styles.titleItem}`}
                    >
                    <span className={styles.titleName}>{title.name}</span>
                    </div>
                ))}
                </div>
            ) : (
                <p className={styles.emptyText}>Aucun titre disponible.</p>
            )}
        </section>

        <section className={styles.skillsCard}>
          <div className={styles.sectionHead}>
            <h2>Compétences</h2>
            <span className={styles.chip}>Top skills</span>
          </div>

          <div className={styles.skillsList}>
            {skills.length > 0 ? (
              skills.map((skill) => {
                const percent = getSkillPercent(skill.level);

                return (
                  <div className={styles.skillRow} key={skill.name}>
                    <div className={styles.skillTop}>
                      <span>{skill.name}</span>
                      <span>{skill.level.toFixed(2)}</span>
                    </div>

                    <div className={styles.skillBar}>
                      <div
                        className={styles.skillBarFill}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className={styles.emptyText}>Aucune compétence disponible.</p>
            )}
          </div>
        </section>



        <section className={styles.projectsCard}>
          <div className={styles.sectionHead}>
            <h2>Derniers projets rendus</h2>
            <span className={styles.chip}>{latestProjects.length} affichés</span>
          </div>

          <div className={styles.projectsTable}>
            <div className={styles.projectsHead}>
              <span>Projet</span>
              <span>Note</span>
              <span>Statut</span>
              <span>Date</span>
            </div>

            {latestProjects.length > 0 ? (
              latestProjects.map((project) => (
                <div
                  className={styles.projectRow}
                  key={`${project.name}-${project.timestamp}`}
                >
                  <span className={styles.projectName}>{project.name}</span>
                  <span>{project.final_mark ?? "-"}</span>
                  <span>
                    <span
                      className={`${styles.statusPill} ${
                        project.validated ? styles.validated : styles.failed
                      }`}
                    >
                      {project.validated ? "Validé" : "Échoué"}
                    </span>
                  </span>
                  <span>{formatDate(project.date)}</span>
                </div>
              ))
            ) : (
              <p className={styles.emptyText}>Aucun projet récent disponible.</p>
            )}
          </div>
        </section>



        <section className={styles.achievementsCard}>
            <div className={styles.sectionHead}>
                <h2>Achievements</h2>
                <span className={styles.chip}>{achievementsCount} validés</span>
            </div>

            {achievements.length > 0 ? (
                <div className={styles.achievementsGrid}>
                {achievements.map((achievement) => (
                    <article className={styles.achievementItem} key={achievement.id}>
                    <div className={styles.achievementTop}>
                        <div className={styles.achievementIcon}>
                        <span>🏆</span>
                        </div>

                        <div className={styles.achievementMeta}>
                        <h3>{achievement.name}</h3>

                        <div className={styles.achievementTags}>
                            {achievement.tier && (
                            <span className={styles.achievementTag}>
                                {achievement.tier}
                            </span>
                            )}

                            {achievement.kind && (
                            <span className={styles.achievementTag}>
                                {achievement.kind}
                            </span>
                            )}
                        </div>
                        </div>
                    </div>

                    {achievement.description && (
                        <p className={styles.achievementDescription}>
                        {achievement.description}
                        </p>
                    )}

                    <div className={styles.achievementFooter}>
                        <span
                        className={`${styles.statusPill} ${
                            achievement.visible ? styles.validated : styles.failed
                        }`}
                        >
                        {achievement.visible ? "Validé" : "Masqué"}
                        </span>
                    </div>
                    </article>
                ))}
                </div>
            ) : (
                <p className={styles.emptyText}>Aucun achievement disponible.</p>
            )}
            </section>


            <section className={styles.timelineCard}>
                <div className={styles.sectionHead}>
                    <h2>Timeline 42</h2>
                    <span className={styles.chip}>{timeline.length} événements</span>
                </div>

                {timeline.length > 0 ? (
                    <div className={styles.timelineList}>
                    {timeline.map((item) => (
                        <article key={item.id} className={styles.timelineItem}>
                        <div className={styles.timelineMarker}>
                            <span
                            className={`${styles.timelineDot} ${
                                item.status === "validated"
                                ? styles.validatedDot
                                : item.status === "failed"
                                ? styles.failedDot
                                : styles.infoDot
                            }`}
                            />
                        </div>

                        <div className={styles.timelineContent}>
                            <div className={styles.timelineTop}>
                            <div>
                                <h3 className={styles.timelineTitle}>{item.title}</h3>
                                {item.subtitle && (
                                <p className={styles.timelineSubtitle}>{item.subtitle}</p>
                                )}
                            </div>

                            <div className={styles.timelineMeta}>
                                <span className={styles.timelineType}>{item.type}</span>
                                <span className={styles.timelineDate}>
                                {formatDate(item.date)}
                                </span>
                            </div>
                            </div>
                        </div>
                        </article>
                    ))}
                    </div>
                ) : (
                    <p className={styles.emptyText}>Aucun événement de timeline disponible.</p>
                )}
            </section>
      </div>
    </div>
  );
}