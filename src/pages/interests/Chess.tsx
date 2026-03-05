import { useEffect, useMemo, useState } from "react";
import styles from "../../styles/chess.module.css";

type Summary = {
  username: string;
  updatedAt: string | null;
  ratings: {
    bullet: number | null;
    blitz: number | null;
    rapid: number | null;
    daily: number | null;
  };
};

type PlayerSide = {
  username: string;
  result: string;
  rating?: number;
};

type Game = {
  url: string;
  time_control: string;
  time_class?: string | null;
  end_time: number;
  rated: boolean;
  rules: string;
  white: PlayerSide;
  black: PlayerSide;
};

type GameOutcome = "WIN" | "LOSS" | "DRAW";

function normalizeTimeClass(game: Game): string {
  const tc = (game.time_class ?? "").toLowerCase();
  if (tc) return tc;

  // fallback basique si time_class absent
  // daily sur chess.com ressemble souvent à "1/86400"
  if (game.time_control?.includes("/")) return "daily";
  return "other";
}

function outcomeFor(username: string, game: Game): { outcome: GameOutcome; color: "white" | "black"; opponent: string } {
  const u = username.toLowerCase();
  const whiteUser = game.white?.username?.toLowerCase() === u;
  const color = whiteUser ? "white" : "black";
  const me = whiteUser ? game.white : game.black;
  const opp = whiteUser ? game.black : game.white;

  const meRes = (me?.result ?? "").toLowerCase();
  const oppRes = (opp?.result ?? "").toLowerCase();

  // Chess.com : si tu as "win" => gagné
  if (meRes === "win") return { outcome: "WIN", color, opponent: opp.username };
  if (oppRes === "win") return { outcome: "LOSS", color, opponent: opp.username };

  // sinon, la plupart du temps c’est un draw (stalemate, repetition, agreed, insufficient, etc.)
  return { outcome: "DRAW", color, opponent: opp.username };
}

function labelTimeClass(tc: string) {
  switch (tc) {
    case "bullet": return "BULLET";
    case "blitz": return "BLITZ";
    case "rapid": return "RAPID";
    case "daily": return "DAILY";
    default: return "OTHER";
  }
}

export default function Chess() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function run() {
      setLoading(true);
      const [s, g] = await Promise.all([
        fetch("/api/chess/summary").then((r) => r.json()),
        fetch("/api/chess/games").then((r) => r.json()),
      ]);
      setSummary(s);
      setGames(g.games ?? []);
      setLoading(false);
    }
    run();
  }, []);

  const username = summary?.username ?? "";

  const gamesUi = useMemo(() => {
    if (!summary) return [];
    return games.map((game) => {
      const tc = normalizeTimeClass(game);
      const info = outcomeFor(username, game);
      return { game, tc, ...info };
    });
  }, [games, summary, username]);

  if (loading) return <p>Chargement…</p>;
  if (!summary) return <p>Erreur: données indisponibles.</p>;

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Échecs</h1>
          <p className={styles.sub}>
            Profil : <strong>{summary.username}</strong> · MAJ :{" "}
            {summary.updatedAt ? new Date(summary.updatedAt).toLocaleString() : "?"}
          </p>
        </div>

        <a
          className={styles.profileBtn}
          href={`https://www.chess.com/member/${summary.username}`}
          target="_blank"
          rel="noreferrer"
        >
          Ouvrir profil Chess.com →
        </a>
      </header>

      <div className={styles.ratings}>
        <div className={styles.ratingCard}>
          <div className={styles.ratingLabel}>Bullet</div>
          <div className={styles.ratingValue}>{summary.ratings.bullet ?? "-"}</div>
        </div>
        <div className={styles.ratingCard}>
          <div className={styles.ratingLabel}>Blitz</div>
          <div className={styles.ratingValue}>{summary.ratings.blitz ?? "-"}</div>
        </div>
        <div className={styles.ratingCard}>
          <div className={styles.ratingLabel}>Rapid</div>
          <div className={styles.ratingValue}>{summary.ratings.rapid ?? "-"}</div>
        </div>
        <div className={styles.ratingCard}>
          <div className={styles.ratingLabel}>Daily</div>
          <div className={styles.ratingValue}>{summary.ratings.daily ?? "-"}</div>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>10 dernières parties</h2>

      <div className={styles.games}>
        {gamesUi.map(({ game, tc, outcome, color, opponent }) => (
          <article
            key={game.url}
            className={`${styles.gameCard} ${styles["o" + outcome]}`}
          >
            <div className={styles.gameLeft}>
              <span className={styles.outcome}>{outcome}</span>
              <span className={styles.mode}>{labelTimeClass(tc)}</span>
              {game.rated && <span className={styles.rated}>RATED</span>}
            </div>

            <div className={styles.gameMid}>
              <div className={styles.line1}>
                <span className={styles.vs}>
                  vs <strong>{opponent}</strong>
                </span>
                <span className={styles.colorTag}>
                  {color === "white" ? "White" : "Black"}
                </span>
              </div>

              <div className={styles.line2}>
                <span className={styles.meta}>
                  {game.rules} · {game.time_control}
                </span>
                <span className={styles.date}>
                  {new Date(game.end_time * 1000).toLocaleString()}
                </span>
              </div>
            </div>

            <div className={styles.gameRight}>
              <a className={styles.link} href={game.url} target="_blank" rel="noreferrer">
                Voir →
              </a>
            </div>
          </article>
        ))}

        {gamesUi.length === 0 && (
          <p className={styles.empty}>Aucune partie trouvée.</p>
        )}
      </div>
    </section>
  );
}