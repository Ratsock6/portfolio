import { useEffect, useMemo, useState } from "react";
import styles from "../../../styles/clashRoyalePage.module.css";

type IconUrls = {
  medium?: string;
  evolutionMedium?: string;
};

type Card = {
  index: number;
  name: string;
  id: number;
  level: number;
  maxLevel: number;
  rarity: string;
  elixirCost: number | null;
  evolutionLevel: number; // -1, 1, 2...
  iconUrls: IconUrls;
};

type PlayerInMatch = {
  name: string;
  tag: string;
  cards: Card[];
  trophyChange: number | null;
  startingTrophies: number | null;
  crowns: number | null;
  elixirLeaked?: number | null;
};

type Match = {
  type: string | null;
  startedAt: string | null;
  arenaName: string | null;
  team: PlayerInMatch[];
  opponent: PlayerInMatch[];
};

type Profile = {
  name: string;
  tag: string;
  expLevel: number;
  trophies: number;
  bestTrophies: number;
  wins: number;
  losses: number;
  battleCount: number;
  threeCrownWins: number;
  totalDonations: number;
  clan: { tag: string; name: string; badgeId: number } | null;
  arena: { id: number; name: string; rawName: string } | null;
};

type ApiData = {
  updatedAt: string | null;
  profile: Profile;
  matches: Match[];
};

function formatStartedAt(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleString();
}

function outcomeFromCrowns(my: number | null, opp: number | null) {
  if (my == null || opp == null) return "UNKNOWN";
  if (my > opp) return "WIN";
  if (my < opp) return "LOSS";
  return "DRAW";
}

/**
 * Règle demandée:
 * - Si evolutionLevel === 1 ET index est 0 ou 1 => utiliser iconUrls.evolutionMedium
 * - Sinon => iconUrls.medium
 */
function pickCardIcon(card: Card): string | null {
  const useEvo = card.evolutionLevel === 1 && (card.index === 0 || card.index === 1);
  return (useEvo ? card.iconUrls?.evolutionMedium : card.iconUrls?.medium) ?? null;
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue}>{value}</div>
      {sub ? <div className={styles.statSub}>{sub}</div> : null}
    </div>
  );
}

export default function ClashRoyalePage() {
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function run() {
      setLoading(true);
      const d = await fetch("/api/clash-royale").then((r) => r.json());
      setData(d);
      setLoading(false);
    }
    run().catch(() => setLoading(false));
  }, []);

  const profile = data?.profile ?? null;
  const matches = data?.matches ?? [];

  const winrate = useMemo(() => {
    if (!profile) return null;
    const total = profile.wins + profile.losses;
    if (!total) return null;
    return Math.round((profile.wins / total) * 100);
  }, [profile]);

  if (loading) return <p>Chargement…</p>;
  if (!profile) return <p>Impossible de charger Clash Royale.</p>;

  const arenaImg = profile.arena?.id
    ? `/gaming/cr/arenas/default.png`
    : "/gaming/cr/arenas/default.png";

  return (
    <section className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>Clash Royale</h1>
            <span className={styles.updated}>
              MAJ {data?.updatedAt ? new Date(data.updatedAt).toLocaleString() : "—"}
            </span>
          </div>

          <div className={styles.profileRow}>
            <div className={styles.profileMain}>
              <div className={styles.playerName}>{profile.name}</div>
              <div className={styles.playerTag}>{profile.tag}</div>
              <div className={styles.playerMeta}>
                Niveau <strong>{profile.expLevel}</strong>
                {profile.clan?.name ? (
                  <>
                    {" "}
                    · Clan <strong>{profile.clan.name}</strong>
                  </>
                ) : null}
              </div>
            </div>

            <div className={styles.trophiesBox}>
              <div className={styles.trophiesTop}>
                <img className={styles.trophyIcon} src="/gaming/cr/trophy.png" alt="" />
                <div className={styles.trophiesValue}>{profile.trophies}</div>
              </div>
              <div className={styles.trophiesSub}>
                Peak: <strong>{profile.bestTrophies}</strong>
              </div>
            </div>
          </div>

          <div className={styles.statsGrid}>
            <StatCard label="Victoires" value={profile.wins} />
            <StatCard label="Défaites" value={profile.losses} />
            <StatCard label="Winrate" value={winrate == null ? "—" : `${winrate}%`} />
            <StatCard label="3 couronnes" value={profile.threeCrownWins} />
            <StatCard label="Combats" value={profile.battleCount} />
            <StatCard label="Dons" value={profile.totalDonations} />
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.arenaCard}>
            <div className={styles.arenaHeader}>
              <span className={styles.arenaBadge}>ARÈNE</span>
              <span className={styles.arenaName}>{profile.arena?.name ?? "—"}</span>
            </div>

            <div className={styles.arenaImageWrap}>
              <img className={styles.arenaImage} src={arenaImg} alt={profile.arena?.name ?? "Arena"} />
              <div className={styles.arenaOverlay} />
            </div>

            <div className={styles.arenaMeta}>
              <span>ID: <strong>{profile.arena?.id ?? "—"}</strong></span>
              <span className={styles.muted}>({profile.arena?.rawName ?? "—"})</span>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.section}>
        <h2 className={styles.h2}>Derniers combats</h2>

        <div className={styles.matches}>
          {matches.slice(0, 10).map((m, idx) => {
            const me = m.team?.[0] ?? null;
            const opp = m.opponent?.[0] ?? null;

            const myCrowns = me?.crowns ?? null;
            const oppCrowns = opp?.crowns ?? null;
            const outcome = outcomeFromCrowns(myCrowns, oppCrowns);

            const trophyChange = me?.trophyChange ?? null;
            const score =
              myCrowns != null && oppCrowns != null ? `${myCrowns} - ${oppCrowns}` : "—";

            return (
              <article
                key={`${m.startedAt ?? idx}`}
                className={`${styles.match} ${
                  outcome === "WIN"
                    ? styles.win
                    : outcome === "LOSS"
                    ? styles.loss
                    : outcome === "DRAW"
                    ? styles.draw
                    : styles.unknown
                }`}
              >
                <div className={styles.matchTop}>
                  <div className={styles.matchLeft}>
                    <span className={styles.outcome}>{outcome}</span>
                    <span className={styles.mode}>{m.type ?? "match"}</span>
                  </div>

                  <div className={styles.matchRight}>
                    <span className={styles.score}>{score}</span>
                    <span className={styles.trophyChange}>
                      {trophyChange == null ? "—" : trophyChange > 0 ? `+${trophyChange}` : trophyChange}
                    </span>
                  </div>
                </div>

                <div className={styles.matchMeta}>
                  <span className={styles.arenaText}>{m.arenaName ?? "—"}</span>
                  <span className={styles.date}>{formatStartedAt(m.startedAt)}</span>
                </div>

                <div className={styles.duelRow}>
                  <div className={styles.playerCol}>
                    <div className={styles.pname}>{me?.name ?? "—"}</div>
                    <div className={styles.deck}>
                      {(me?.cards ?? []).map((c) => (
                        <img
                          key={c.id}
                          className={styles.cardIcon}
                          src={pickCardIcon(c) ?? "/clash/ui/card-placeholder.png"}
                          alt={c.name}
                          title={`${c.name} · lvl ${c.level}`}
                          loading="lazy"
                        />
                      ))}
                    </div>
                  </div>

                  <div className={styles.vs}>VS</div>

                  <div className={styles.playerCol}>
                    <div className={styles.pname}>{opp?.name ?? "—"}</div>
                    <div className={styles.deck}>
                      {(opp?.cards ?? []).map((c) => (
                        <img
                          key={c.id}
                          className={styles.cardIcon}
                          src={pickCardIcon(c) ?? "/clash/ui/card-placeholder.png"}
                          alt={c.name}
                          title={`${c.name} · lvl ${c.level}`}
                          loading="lazy"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}