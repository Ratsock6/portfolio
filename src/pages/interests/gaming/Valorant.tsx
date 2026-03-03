import { useEffect, useMemo, useState } from "react";
import styles from "../../../styles/valorant.module.css";

type ValorantData = {
  updatedAt: string | null;
  profile: {
    name: string;
    tag: string;
    region: string;
    rank: string | null;
    rr: number | null;
    mmr: number | null;
    lastUpdated: string | null;
  } | null;
  matches: Array<any>;
  favorites: { agents: string[]; maps: string[] } | null;
};

type Outcome = "WIN" | "LOSS" | "DRAW" | "UNKNOWN";

const DEFAULT_AGENT_ICON = "/gaming/logos/default.png";

function safeLower(s: unknown) {
  return String(s ?? "").toLowerCase();
}

function computeOutcomeForMe(match: any, meName: string): Outcome {
  // On cherche le player "me" dans players/all_players
  const all = match?.players?.all_players ?? match?.players?.all_players ?? [];
  const me = all.find((p: any) => safeLower(p?.name) === safeLower(meName));
  if (!me) return "UNKNOWN";

  const myTeam = safeLower(me?.team); // "red" / "blue"
  const teams = match?.teams ?? null;

  const redWon = teams?.red?.has_won;
  const blueWon = teams?.blue?.has_won;

  if (redWon === true && myTeam === "red") return "WIN";
  if (blueWon === true && myTeam === "blue") return "WIN";
  if (redWon === true || blueWon === true) return "LOSS";

  // si aucune info, fallback
  return "UNKNOWN";
}

function extractMyStats(match: any, meName: string) {
  const all = match?.players?.all_players ?? [];
  const me = all.find((p: any) => safeLower(p?.name) === safeLower(meName));
  if (!me) return null;

  return {
    team: me.team,
    agent: me.character,
    k: me.stats?.kills ?? null,
    d: me.stats?.deaths ?? null,
    a: me.stats?.assists ?? null,
    hs: me.stats?.headshots ?? null,
    body: me.stats?.bodyshots ?? null,
    leg: me.stats?.legshots ?? null,
    acs: me.stats?.score ?? null,
  };
}

export default function ValorantPage() {
  const [data, setData] = useState<ValorantData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function run() {
      setLoading(true);
      const d = await fetch("/api/valorant").then((r) => r.json());
      setData(d);
      setLoading(false);
    }
    run();
  }, []);

  const profile = data?.profile ?? null;
  const matches = data?.matches ?? [];

  const matchesUi = useMemo(() => {
    if (!profile) return [];
    return matches.slice(0, 10).map((m) => {
      const map = m?.metadata?.map ?? m?.map ?? "Unknown";
      const mode = m?.metadata?.mode ?? m?.mode ?? "Unknown";
      const startedAt = m?.metadata?.game_start_patched ?? m?.startedAt ?? null;

      const outcome = computeOutcomeForMe(m, profile.name);
      const my = extractMyStats(m, profile.name);

      return {
        id: m?.metadata?.matchid ?? m?.matchId ?? JSON.stringify(m).slice(0, 24),
        map,
        mode,
        startedAt,
        outcome,
        my,
      };
    });
  }, [matches, profile]);

  if (loading) return <p>Chargement…</p>;
  if (!data || !profile) return <p>Impossible de charger les données Valorant.</p>;

  return (
    <section className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div>
            <h1 className={styles.title}>VALORANT</h1>
            <p className={styles.sub}>
              {profile.name}#{profile.tag} · {profile.region.toUpperCase()} · MAJ{" "}
              {data.updatedAt ? new Date(data.updatedAt).toLocaleString() : "?"}
            </p>
          </div>

          <div className={styles.rankCard}>
            <div className={styles.rankTop}>
              <span className={styles.rankLabel}>RANK</span>
              <span className={styles.rr}>
                {profile.rr ?? "—"} <span className={styles.rrUnit}>RR</span>
              </span>
            </div>
            <div className={styles.rankName}>{profile.rank ?? "Non classé"}</div>
            <div className={styles.rankMeta}>
              MMR: {profile.mmr ?? "—"} · {profile.lastUpdated ?? "—"}
            </div>
          </div>
        </div>
      </header>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h2>10 derniers matchs</h2>

          <div className={styles.matches}>
            {matchesUi.map((m) => (
              <article
                key={m.id}
                className={`${styles.match} ${
                  m.outcome === "WIN"
                    ? styles.win
                    : m.outcome === "LOSS"
                    ? styles.loss
                    : m.outcome === "DRAW"
                    ? styles.draw
                    : styles.unknown
                }`}
              >
                <div className={styles.left}>
                  <span className={styles.outcome}>{m.outcome}</span>
                  <span className={styles.mode}>{m.mode}</span>
                </div>

                <div className={styles.mid}>
                  <div className={styles.line1}>
                    <strong className={styles.map}>{m.map}</strong>
                    <span className={styles.date}>
                      {m.startedAt ? m.startedAt : ""}
                    </span>
                  </div>

                  {m.my ? (
                    <div className={styles.line2}>
                      <span className={styles.agent}>
                        Agent: <strong>{m.my.agent ?? "—"}</strong>
                      </span>
                      <span className={styles.kda}>
                        K/D/A:{" "}
                        <strong>
                          {m.my.k ?? "—"}/{m.my.d ?? "—"}/{m.my.a ?? "—"}
                        </strong>
                      </span>
                      <span className={styles.acs}>
                        Score: <strong>{m.my.acs ?? "—"}</strong>
                      </span>
                    </div>
                  ) : (
                    <div className={styles.line2}>
                      <span className={styles.muted}>Stats indisponibles.</span>
                    </div>
                  )}
                </div>

                <div className={styles.right}>
                  <img
                    className={styles.agentIcon}
                    src={DEFAULT_AGENT_ICON}
                    alt=""
                    aria-hidden="true"
                  />
                </div>
              </article>
            ))}

            {matchesUi.length === 0 && (
              <p className={styles.muted}>Aucun match trouvé.</p>
            )}
          </div>
        </div>

        <div className={styles.card}>
          <h2>Préférences</h2>

          <div className={styles.favs}>
            <div>
              <h3>Agents préférés</h3>
              <div className={styles.chips}>
                {(data.favorites?.agents ?? []).map((a) => (
                  <span key={a} className={styles.chip}>
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3>Maps préférées</h3>
              <div className={styles.chips}>
                {(data.favorites?.maps ?? []).map((m) => (
                  <span key={m} className={styles.chip}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className={styles.hint}>
            (Ensuite : favoris calculés automatiquement via tes matchs + icônes agents/maps via Valorant-API.com.)
          </p>
        </div>
      </div>
    </section>
  );
}