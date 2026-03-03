import { useEffect, useMemo, useState } from "react";
import styles from "../../styles/f1.module.css";

type F1Data = {
  updatedAt: string | null;
  season: number;
  calendar: Array<{
    round: number;
    raceName: string;
    circuitName: string;
    locality: string;
    country: string;
    date: string;
    time: string | null;
  }>;
  standings: Array<{
    position: number;
    points: number;
    wins: number;
    driver: { givenName: string; familyName: string; code: string | null; number: number | null };
    constructor: { id: string | null; name: string | null };
  }>;
};

// Couleurs (tu peux affiner au fur et à mesure)
const TEAM_COLORS: Record<string, string> = {
  ferrari: "#DC0000",
  mercedes: "#00D2BE",
  red_bull: "#1E41FF",
  mclaren: "#FF8700",
  aston_martin: "#006F62",
  alpine: "#0090FF",
  williams: "#005AFF",
  haas: "#B6BABD",
  rb: "#2B4562",
  sauber: "#00FF00",
  audi: "#000000",
  cadillac: "#B9C6D3",
};

function colorForTeam(teamId: string | null) {
  if (!teamId) return "rgba(255,255,255,0.25)";
  return TEAM_COLORS[teamId] ?? "rgba(255,255,255,0.25)";
}

export default function F1() {
  const [data, setData] = useState<F1Data | null>(null);

  useEffect(() => {
    fetch("/api/f1")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  const nextRace = useMemo(() => {
    if (!data?.calendar?.length) return null;
    const now = new Date();
    return data.calendar.find((r) => new Date(r.date) >= new Date(now.toISOString().slice(0, 10))) ?? data.calendar[0];
  }, [data]);

  if (!data) return <p>Chargement…</p>;

  return (
    <section className={`${styles.page} ${styles.ferrari}`}>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.title}>FORMULA 1 — Saison {data.season}</h1>
          <p className={styles.sub}>
            MAJ : {data.updatedAt ? new Date(data.updatedAt).toLocaleString() : "?"}
          </p>

          {nextRace && (
            <div className={styles.nextRace}>
              <span className={styles.badge}>Prochaine course</span>
              <div className={styles.nextRaceMain}>
                <strong>R{nextRace.round}</strong> — {nextRace.raceName} ({nextRace.locality})
                <span className={styles.nextRaceDate}>
                  {new Date(nextRace.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.grid}>
        <div className={`${styles.card} ${styles.calendarCard}`}>
          <h2>Calendrier</h2>
          <div className={styles.table}>
            {data.calendar.map((r) => (
              <div key={r.round} className={styles.row}>
                <div className={styles.round}>R{r.round}</div>
                <div className={styles.race}>
                  <div className={styles.raceName}>{r.raceName}</div>
                  <div className={styles.raceMeta}>
                    {r.locality}, {r.country} — {r.circuitName}
                  </div>
                </div>
                <div className={styles.date}>{new Date(r.date).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${styles.card} ${styles.driversCard}`}>
          <h2>Classement pilotes</h2>

          {data.standings.length === 0 ? (
            <p className={styles.muted}>Pré-saison : aucun classement disponible pour l’instant.</p>
          ) : (
            <div className={styles.standings}>
              {data.standings.map((s) => (
                <div key={`${s.position}-${s.driver.familyName}`} className={styles.standingRow}>
                  <div className={styles.pos}>{s.position}</div>

                  <div className={styles.driver}>
                    <div className={styles.driverTop}>
                      <span className={styles.number}>{s.driver.number ?? "—"}</span>
                      <span className={styles.name}>
                        {s.driver.givenName} <strong>{s.driver.familyName}</strong>
                      </span>
                    </div>
                    <div className={styles.teamLine}>
                      <span
                        className={styles.teamDot}
                        style={{ background: colorForTeam(s.constructor.id) }}
                        aria-hidden="true"
                      />
                      <span className={styles.teamName}>{s.constructor.name ?? "—"}</span>
                    </div>
                  </div>

                  <div className={styles.points}>
                    <strong>{s.points}</strong>
                    <span className={styles.pointsLabel}>pts</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}