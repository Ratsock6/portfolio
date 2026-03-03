import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import styles from "../../../styles/valorantMatch.module.css";

type Match = any;

function safeLower(s: unknown) {
  return String(s ?? "").toLowerCase();
}

export default function ValorantMatchDetail() {
  const { matchId } = useParams();
  const [match, setMatch] = useState<Match | null>(null);
  const [meName, setMeName] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      // On récupère le profil pour connaître TON pseudo (pour te highlight dans le scoreboard)
      const base = await fetch("/api/valorant").then((r) => r.json());
      setMeName(base?.profile?.name ?? null);

      const m = await fetch(`/api/valorant/matches/${matchId}`).then((r) => {
        if (!r.ok) return null;
        return r.json();
      });
      setMatch(m);
    }
    run();
  }, [matchId]);

  const allPlayers = match?.players?.all_players ?? [];
  const meta = match?.metadata ?? {};

  const { red, blue } = useMemo(() => {
    const r = [];
    const b = [];
    for (const p of allPlayers) {
      const t = safeLower(p?.team);
      if (t === "red") r.push(p);
      else if (t === "blue") b.push(p);
    }

    // tri par score desc si dispo
    const byScore = (x: any, y: any) => (y?.stats?.score ?? 0) - (x?.stats?.score ?? 0);
    r.sort(byScore);
    b.sort(byScore);

    return { red: r, blue: b };
  }, [allPlayers]);

  function isMe(p: any) {
    if (!meName) return false;
    return safeLower(p?.name) === safeLower(meName);
  }

  if (!match) {
    return (
      <section>
        <Link to="/interests/gaming/valorant">← Retour Valorant</Link>
        <h1>Match introuvable</h1>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.top}>
        <Link className={styles.back} to="/interests/gaming/valorant">
          ← Retour Valorant
        </Link>

        <div className={styles.header}>
          <h1 className={styles.title}>Détails du match</h1>
          <div className={styles.sub}>
            {meta.map ?? "Unknown map"} · {meta.mode ?? "Unknown mode"} ·{" "}
            {meta.game_start_patched ?? ""}
          </div>
        </div>
      </div>

      <div className={styles.metaGrid}>
        <div className={styles.metaCard}>
          <div className={styles.metaLabel}>Match ID</div>
          <div className={styles.metaValue}>{meta.matchid ?? matchId}</div>
        </div>
        <div className={styles.metaCard}>
          <div className={styles.metaLabel}>Queue</div>
          <div className={styles.metaValue}>{meta.queue ?? "—"}</div>
        </div>
        <div className={styles.metaCard}>
          <div className={styles.metaLabel}>Région</div>
          <div className={styles.metaValue}>{meta.region ?? "—"}</div>
        </div>
      </div>

      <div className={styles.boards}>
        <div className={styles.board}>
          <div className={styles.boardTitle}>RED</div>
          <div className={styles.table}>
            <div className={`${styles.row} ${styles.head}`}>
              <div>Joueur</div><div>Agent</div><div>K</div><div>D</div><div>A</div><div>Score</div>
            </div>

            {red.map((p: any) => (
              <div key={p?.puuid ?? p?.name} className={`${styles.row} ${isMe(p) ? styles.me : ""}`}>
                <div className={styles.player}>{p?.name}</div>
                <div className={styles.agent}>{p?.character ?? "—"}</div>
                <div>{p?.stats?.kills ?? "—"}</div>
                <div>{p?.stats?.deaths ?? "—"}</div>
                <div>{p?.stats?.assists ?? "—"}</div>
                <div>{p?.stats?.score ?? "—"}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.board}>
          <div className={styles.boardTitle}>BLUE</div>
          <div className={styles.table}>
            <div className={`${styles.row} ${styles.head}`}>
              <div>Joueur</div><div>Agent</div><div>K</div><div>D</div><div>A</div><div>Score</div>
            </div>

            {blue.map((p: any) => (
              <div key={p?.puuid ?? p?.name} className={`${styles.row} ${isMe(p) ? styles.me : ""}`}>
                <div className={styles.player}>{p?.name}</div>
                <div className={styles.agent}>{p?.character ?? "—"}</div>
                <div>{p?.stats?.kills ?? "—"}</div>
                <div>{p?.stats?.deaths ?? "—"}</div>
                <div>{p?.stats?.assists ?? "—"}</div>
                <div>{p?.stats?.score ?? "—"}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}