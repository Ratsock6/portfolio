import { useEffect, useMemo, useState } from "react";
import styles from "../../../styles/cocPage.module.css";
import { useCountUp } from "../../../app/hooks/useCountUp";

type IconUrls = { small?: string; medium?: string; large?: string; tiny?: string };
type Label = { id: number; name: string; iconUrls: IconUrls };

type League = { id: number; name: string; iconUrls: IconUrls };
type BuilderBaseLeague = { id: number; name: string };

type Clan = {
    tag: string;
    name: string;
    clanLevel: number;
    badgeUrls: IconUrls;
};

type HomeVillage = "home" | "builderBase" | "clanCapital";

type Achievement = {
    name: string;
    stars: number;
    value: number;
    target: number;
    info: string;
    completionInfo: string | null;
    village: HomeVillage;
};

type Troop = { name: string; level: number; maxLevel: number; village: HomeVillage };
type Spell = { name: string; level: number; maxLevel: number; village: HomeVillage };
type Hero = { name: string; level: number; maxLevel: number; village: HomeVillage };
type HeroEquipment = { name: string; level: number; maxLevel: number; village: HomeVillage };

type PlayerProfile = {
    tag: string;
    name: string;
    townHallLevel: number;
    townHallWeaponLevel?: number;
    expLevel: number;

    trophies: number;
    bestTrophies: number;

    builderHallLevel?: number;
    builderBaseTrophies?: number;
    bestBuilderBaseTrophies?: number;

    warStars: number;

    attackWins?: number;
    defenseWins?: number;

    donations?: number;
    donationsReceived?: number;

    clan?: Clan | null;

    league?: League | null;
    builderBaseLeague?: BuilderBaseLeague | null;

    clanCapitalContributions?: number;

    labels?: Label[];

    achievements?: Achievement[];

    troops?: Troop[];
    spells?: Spell[];
    heroes?: Hero[];
    heroEquipment?: HeroEquipment[];
};

type BattleLogItem = {
    battleTime: string;
    battleType: string; // "regular", etc.
    attack?: boolean; // true attaque / false défense
    stars?: number;
    destructionPercentage?: number;
    opponent?: { tag?: string; name?: string; townHallLevel?: number };
    team?: Array<{ tag?: string; name?: string; townHallLevel?: number }>;
    attacks?: Array<{ attackerTag?: string; defenderTag?: string; stars?: number; destructionPercentage?: number }>;

    // loot
    loot?: { gold?: number; elixir?: number; darkElixir?: number };
    // parfois l’API renvoie "clanCapitalGold" / "capitalGold" selon contexte
    clanCapitalGold?: number;

    // utile: lien partage armée (si présent)
    armyShareCode?: string;
};

type CocApi = {
    updatedAt: string | null;
    playerTag: string | null;
    profile: PlayerProfile | null;
    battlelog: { items: BattleLogItem[] };
};

function clamp01(x: number) {
    return Math.max(0, Math.min(1, x));
}

function fmtUpdatedAt(s: string | null) {
    if (!s) return "—";
    const d = new Date(s);
    return isNaN(d.getTime()) ? s : d.toLocaleString("fr-FR");
}

function formatCompact(n: number | null | undefined) {
    const x = Number(n ?? 0);
    if (!Number.isFinite(x)) return "—";
    const abs = Math.abs(x);
    if (abs >= 1_000_000_000) return `${(x / 1_000_000_000).toFixed(1)}B`;
    if (abs >= 1_000_000) return `${(x / 1_000_000).toFixed(1)}M`;
    if (abs >= 10_000) return `${(x / 1_000).toFixed(1)}k`;
    return x.toLocaleString("fr-FR");
}

function starsText(stars?: number) {
    const s = Number(stars ?? 0);
    return "★".repeat(Math.max(0, Math.min(3, s))) + "☆".repeat(Math.max(0, 3 - s));
}

function formatBattleTime(battleTime: string) {
    // COC donne souvent "20260305T133846.000Z" → on reuse ton parser Clash si tu veux
    const s = String(battleTime ?? "").trim();
    const m = s.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(?:\.(\d{1,3}))?Z$/);
    if (m) {
        const [, Y, Mo, D, h, mi, se, ms = "000"] = m;
        const iso = `${Y}-${Mo}-${D}T${h}:${mi}:${se}.${ms.padEnd(3, "0")}Z`;
        const d = new Date(iso);
        if (!isNaN(d.getTime())) return d.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
    }
    const d = new Date(s);
    return isNaN(d.getTime()) ? s : d.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}

function progressPercent(level: number, maxLevel: number) {
    if (!maxLevel) return 0;
    return Math.round(clamp01(level / maxLevel) * 100);
}

export default function ClashOfClansPage() {
    const [data, setData] = useState<CocApi | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function run() {
            setLoading(true);
            const d = await fetch("/api/coc").then((r) => r.json());
            setData(d);
            setLoading(false);
        }
        run().catch((e) => {
            console.error("COC load failed", e);
            setLoading(false);
        });
    }, []);

    const profile = data?.profile ?? null;

    // animations count-up
    const trophiesTarget = profile?.trophies ?? 0;
    const bestTrophiesTarget = profile?.bestTrophies ?? 0;
    const builderTrophiesTarget = profile?.builderBaseTrophies ?? 0;

    const trophies = useCountUp(trophiesTarget, { durationMs: 900 });
    const bestTrophies = useCountUp(bestTrophiesTarget, { durationMs: 1100 });
    const builderTrophies = useCountUp(builderTrophiesTarget, { durationMs: 900 });

    const topAchievements = useMemo(() => {
        const list = profile?.achievements ?? [];
        // priorité : achievements pas finis, tri par % d’avancement décroissant
        const inProgress = list
            .filter((a) => a.target > 0 && a.value < a.target)
            .map((a) => ({ ...a, pct: a.target ? a.value / a.target : 0 }))
            .sort((a, b) => (b.pct ?? 0) - (a.pct ?? 0))
            .slice(0, 10);

        const completed = list
            .filter((a) => a.stars === 3)
            .slice(0, 6);

        return { inProgress, completed };
    }, [profile]);

    const battleItems = useMemo(() => (data?.battlelog?.items ?? []).slice(0, 12), [data]);

    const heroes = useMemo(() => (profile?.heroes ?? []).filter((h) => h.village === "home"), [profile]);
    const builderHeroes = useMemo(() => (profile?.heroes ?? []).filter((h) => h.village === "builderBase"), [profile]);
    const equipment = useMemo(() => (profile?.heroEquipment ?? []).filter((e) => e.village === "home"), [profile]);

    const troopsHomeTop = useMemo(() => {
        const t = (profile?.troops ?? []).filter((x) => x.village === "home");
        // garder les plus hauts niveaux
        return [...t].sort((a, b) => (b.level / b.maxLevel) - (a.level / a.maxLevel)).slice(0, 16);
    }, [profile]);

    const spellsTop = useMemo(() => {
        const s = (profile?.spells ?? []).filter((x) => x.village === "home");
        return [...s].sort((a, b) => (b.level / b.maxLevel) - (a.level / a.maxLevel)).slice(0, 10);
    }, [profile]);

    if (loading) return <p>Chargement…</p>;
    if (!data || !profile) return <p>Impossible de charger Clash of Clans.</p>;

    const leagueIcon = profile.league?.iconUrls?.medium ?? "/coc/icons/league.png";
    const clanBadge = profile.clan?.badgeUrls?.medium ?? "/coc/icons/clan.png";

    const thImg = `/coc/townhalls/th${profile.townHallLevel}.png`; // placeholder
    const builderImg = `/coc/builderhalls/bh${profile.builderHallLevel ?? 0}.png`; // placeholder

    return (
        <section className={styles.page}>
            <header className={styles.hero}>
                <div className={styles.heroLeft}>
                    <div className={styles.heroTop}>
                        <div className={styles.playerBlock}>
                            <h1 className={styles.title}>Clash of Clans</h1>
                            <div className={styles.playerName}>{profile.name}</div>
                            <div className={styles.metaLine}>
                                <span className={styles.tag}>{profile.tag}</span>
                                <span className={styles.dot}>•</span>
                                <span>MAJ {fmtUpdatedAt(data.updatedAt)}</span>
                            </div>
                        </div>

                        <div className={styles.badges}>
                            <div className={styles.badge}>
                                <img className={styles.badgeIcon} src={leagueIcon} alt="" aria-hidden="true" />
                                <div className={styles.badgeText}>
                                    <div className={styles.badgeTitle}>{profile.league?.name ?? "League"}</div>
                                    <div className={styles.badgeSub}>{trophies} trophées</div>
                                </div>
                            </div>

                            <div className={styles.badge}>
                                <img className={styles.badgeIcon} src={clanBadge} alt="" aria-hidden="true" />
                                <div className={styles.badgeText}>
                                    <div className={styles.badgeTitle}>{profile.clan?.name ?? "Sans clan"}</div>
                                    <div className={styles.badgeSub}>
                                        {profile.clan ? `Niv. ${profile.clan.clanLevel}` : "—"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.kpis}>
                        <div className={styles.kpiCard}>
                            <div className={styles.kpiHead}>
                                <img className={styles.kpiIcon} src="/coc/icons/trophy.png" alt="" aria-hidden="true" />
                                <div className={styles.kpiLabel}>Trophées</div>
                            </div>
                            <div className={styles.kpiValue}>{trophies}</div>
                            <div className={styles.kpiSub}>Best: {bestTrophies}</div>
                            <div className={styles.kpiGauge}>
                                <div
                                    className={styles.kpiFill}
                                    style={{ width: `${Math.min(100, Math.round((profile.trophies / Math.max(1, profile.bestTrophies)) * 100))}%` }}
                                />
                            </div>
                        </div>

                        <div className={styles.kpiCard}>
                            <div className={styles.kpiHead}>
                                <img className={styles.kpiIcon} src="/coc/icons/builder_trophy.png" alt="" aria-hidden="true" />
                                <div className={styles.kpiLabel}>Builder Base</div>
                            </div>
                            <div className={styles.kpiValue}>{builderTrophies}</div>
                            <div className={styles.kpiSub}>
                                BH {profile.builderHallLevel ?? "—"} • Best {formatCompact(profile.bestBuilderBaseTrophies)}
                            </div>
                            <div className={styles.kpiGauge}>
                                <div
                                    className={styles.kpiFill}
                                    style={{
                                        width: `${Math.min(
                                            100,
                                            Math.round(((profile.builderBaseTrophies ?? 0) / Math.max(1, profile.bestBuilderBaseTrophies ?? 1)) * 100)
                                        )}%`,
                                    }}
                                />
                            </div>
                        </div>

                        <div className={styles.kpiCard}>
                            <div className={styles.kpiHead}>
                                <img className={styles.kpiIcon} src="/coc/icons/war_star.png" alt="" aria-hidden="true" />
                                <div className={styles.kpiLabel}>War</div>
                            </div>
                            <div className={styles.kpiValue}>{formatCompact(profile.warStars)}</div>
                            <div className={styles.kpiSub}>
                                Att: {formatCompact(profile.attackWins)} • Def: {formatCompact(profile.defenseWins)}
                            </div>
                            <div className={styles.kpiGauge}>
                                <div className={styles.kpiFill} style={{ width: `${Math.min(100, Math.round((profile.warStars / 3000) * 100))}%` }} />
                            </div>
                        </div>

                        <div className={styles.kpiCard}>
                            <div className={styles.kpiHead}>
                                <img className={styles.kpiIcon} src="/coc/icons/capital_gold.png" alt="" aria-hidden="true" />
                                <div className={styles.kpiLabel}>Capital</div>
                            </div>
                            <div className={styles.kpiValue}>{formatCompact(profile.clanCapitalContributions)}</div>
                            <div className={styles.kpiSub}>Contributions</div>
                            <div className={styles.kpiGauge}>
                                <div className={styles.kpiFill} style={{ width: `${Math.min(100, Math.round(((profile.clanCapitalContributions ?? 0) / 50_000) * 100))}%` }} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.progressRow}>
                        <div className={styles.progressCard}>
                            <div className={styles.progressTop}>
                                <img className={styles.progressImg} src={thImg} alt="" aria-hidden="true" />
                                <div>
                                    <div className={styles.progressTitle}>Town Hall</div>
                                    <div className={styles.progressSub}>
                                        TH {profile.townHallLevel}
                                        {profile.townHallWeaponLevel ? ` • Weapon ${profile.townHallWeaponLevel}` : ""}
                                        {" • "}Lvl {profile.expLevel}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.labelRow}>
                                {(profile.labels ?? []).slice(0, 3).map((l) => (
                                    <span key={l.id} className={styles.labelChip}>
                                        <img className={styles.labelIcon} src={l.iconUrls?.small ?? "/coc/icons/label.png"} alt="" aria-hidden="true" />
                                        {l.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className={styles.progressCard}>
                            <div className={styles.progressTop}>
                                <img className={styles.progressImg} src={builderImg} alt="" aria-hidden="true" />
                                <div>
                                    <div className={styles.progressTitle}>Builder Hall</div>
                                    <div className={styles.progressSub}>
                                        BH {profile.builderHallLevel ?? "—"} • {formatCompact(profile.builderBaseTrophies)} trophées
                                    </div>
                                </div>
                            </div>

                            <div className={styles.miniRow}>
                                <div className={styles.miniKpi}>
                                    <span className={styles.miniLabel}>Dons</span>
                                    <strong className={styles.miniValue}>{formatCompact(profile.donations)}</strong>
                                </div>
                                <div className={styles.miniKpi}>
                                    <span className={styles.miniLabel}>Reçus</span>
                                    <strong className={styles.miniValue}>{formatCompact(profile.donationsReceived)}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <aside className={styles.heroRight}>
                    <div className={styles.panel}>
                        <div className={styles.panelTitle}>Héros</div>

                        <div className={styles.entityGrid}>
                            {heroes.map((h) => (
                                <div key={h.name} className={styles.entityCard}>
                                    <div className={styles.entityTop}>
                                        <img className={styles.entityIcon} src={`/coc/heroes/${h.name}.png`} alt="" onError={(e) => ((e.currentTarget.src = "/coc/icons/hero.png"))} />
                                        <div className={styles.entityText}>
                                            <div className={styles.entityName}>{h.name}</div>
                                            <div className={styles.entitySub}>
                                                lvl {h.level} / {h.maxLevel}
                                            </div>
                                        </div>
                                        <div className={styles.entityPct}>{progressPercent(h.level, h.maxLevel)}%</div>
                                    </div>

                                    <div className={styles.bar}>
                                        <div className={styles.barFill} style={{ width: `${progressPercent(h.level, h.maxLevel)}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {builderHeroes.length > 0 ? (
                            <>
                                <div className={styles.subTitle}>Builder Base</div>
                                <div className={styles.entityGrid}>
                                    {builderHeroes.map((h) => (
                                        <div key={h.name} className={styles.entityCard}>
                                            <div className={styles.entityTop}>
                                                <img className={styles.entityIcon} src={`/coc/heroes/${h.name}.png`} alt="" onError={(e) => ((e.currentTarget.src = "/coc/icons/hero.png"))} />
                                                <div className={styles.entityText}>
                                                    <div className={styles.entityName}>{h.name}</div>
                                                    <div className={styles.entitySub}>
                                                        lvl {h.level} / {h.maxLevel}
                                                    </div>
                                                </div>
                                                <div className={styles.entityPct}>{progressPercent(h.level, h.maxLevel)}%</div>
                                            </div>
                                            <div className={styles.bar}>
                                                <div className={styles.barFill} style={{ width: `${progressPercent(h.level, h.maxLevel)}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : null}

                        {equipment.length > 0 ? (
                            <>
                                <div className={styles.subTitle}>Équipement héros</div>
                                <div className={styles.entityGrid}>
                                    {equipment.slice(0, 10).map((eq) => (
                                        <div key={eq.name} className={styles.entityCard}>
                                            <div className={styles.entityTop}>
                                                <img className={styles.entityIcon} src={`/coc/equipment/${eq.name}.png`} alt="" onError={(e) => ((e.currentTarget.src = "/coc/icons/equipment.png"))} />
                                                <div className={styles.entityText}>
                                                    <div className={styles.entityName}>{eq.name}</div>
                                                    <div className={styles.entitySub}>
                                                        lvl {eq.level} / {eq.maxLevel}
                                                    </div>
                                                </div>
                                                <div className={styles.entityPct}>{progressPercent(eq.level, eq.maxLevel)}%</div>
                                            </div>
                                            <div className={styles.bar}>
                                                <div className={styles.barFill} style={{ width: `${progressPercent(eq.level, eq.maxLevel)}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : null}
                    </div>
                </aside>
            </header>

            <div className={styles.twoCols}>
                <div className={styles.panel}>
                    <div className={styles.panelTitle}>Armée (top)</div>

                    <div className={styles.unitSection}>
                        <div className={styles.subTitle}>Troupes</div>
                        <div className={styles.unitGrid}>
                            {troopsHomeTop.map((t) => (
                                <div key={t.name} className={styles.unitCard}>
                                    <img className={styles.unitIcon} src={`/coc/troops/${t.name}.png`} alt="" onError={(e) => ((e.currentTarget.src = "/coc/icons/troop.png"))} />
                                    <div className={styles.unitText}>
                                        <div className={styles.unitName}>{t.name}</div>
                                        <div className={styles.unitSub}>
                                            lvl {t.level}/{t.maxLevel}
                                        </div>
                                    </div>
                                    <div className={styles.unitBar}>
                                        <div className={styles.unitFill} style={{ width: `${progressPercent(t.level, t.maxLevel)}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.subTitle}>Sorts</div>
                        <div className={styles.unitGrid}>
                            {spellsTop.map((s) => (
                                <div key={s.name} className={styles.unitCard}>
                                    <img className={styles.unitIcon} src={`/coc/spells/${s.name}.png`} alt="" onError={(e) => ((e.currentTarget.src = "/coc/icons/spell.png"))} />
                                    <div className={styles.unitText}>
                                        <div className={styles.unitName}>{s.name}</div>
                                        <div className={styles.unitSub}>
                                            lvl {s.level}/{s.maxLevel}
                                        </div>
                                    </div>
                                    <div className={styles.unitBar}>
                                        <div className={styles.unitFill} style={{ width: `${progressPercent(s.level, s.maxLevel)}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.panel}>
                    <div className={styles.panelTitle}>Achievements</div>

                    <div className={styles.achWrap}>
                        <div className={styles.subTitle}>En cours</div>
                        <div className={styles.achList}>
                            {topAchievements.inProgress.map((a) => {
                                const pct = a.target ? Math.round((a.value / a.target) * 100) : 0;
                                return (
                                    <div key={a.name} className={styles.achItem}>
                                        <div className={styles.achTop}>
                                            <div className={styles.achName}>
                                                {a.name} <span className={styles.achStars}>({a.stars}/3)</span>
                                            </div>
                                            <div className={styles.achPct}>{pct}%</div>
                                        </div>

                                        <div className={styles.achInfo}>{a.info}</div>
                                        <div className={styles.achBar}>
                                            <div className={styles.achFill} style={{ width: `${Math.min(100, pct)}%` }} />
                                        </div>
                                        <div className={styles.achSub}>
                                            {formatCompact(a.value)} / {formatCompact(a.target)} • {a.village}
                                        </div>
                                    </div>
                                );
                            })}

                            {topAchievements.inProgress.length === 0 ? (
                                <div className={styles.empty}>Rien en cours (ou achievements non fournis).</div>
                            ) : null}
                        </div>

                        <div className={styles.subTitle}>Complétés</div>
                        <div className={styles.achBadges}>
                            {topAchievements.completed.map((a) => (
                                <div key={a.name} className={styles.achBadge} title={a.info}>
                                    <div className={styles.achBadgeName}>{a.name}</div>
                                    <div className={styles.achBadgeStars}>★★★</div>
                                </div>
                            ))}
                            {topAchievements.completed.length === 0 ? <div className={styles.empty}>—</div> : null}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.panel}>
                <div className={styles.panelTitle}>Battlelog</div>

                <div className={styles.battleList}>
                    {battleItems.map((b, idx) => {
                        const isAttack = b.attack === true;
                        const stars = Number(b.stars ?? 0);
                        const pct = Number(b.destructionPercentage ?? 0);

                        const gold = b.loot?.gold ?? 0;
                        const elixir = b.loot?.elixir ?? 0;
                        const dark = b.loot?.darkElixir ?? 0;
                        const cap = b.clanCapitalGold ?? 0;

                        const oppName = b.opponent?.name ?? "—";
                        const oppTag = b.opponent?.tag ?? "";
                        const oppTH = b.opponent?.townHallLevel;

                        return (
                            <div
                                key={`${b.battleTime}-${idx}`}
                                className={`${styles.battleCard} ${isAttack ? styles.attack : styles.defense}`}
                            >
                                <div className={styles.battleStripe} />

                                <div className={styles.battleBody}>
                                    <div className={styles.battleTop}>
                                        <div className={styles.battleLeft}>
                                            <div className={styles.battleMode}>{isAttack ? "ATTACK" : "DEFENSE"}</div>
                                            <div className={styles.battleMeta}>
                                                {formatBattleTime(b.battleTime)} • {b.battleType ?? "battle"}
                                            </div>
                                        </div>

                                        <div className={styles.battleScore}>
                                            <div className={styles.starLine}>{starsText(stars)}</div>
                                            <div className={styles.pct}>{pct}%</div>
                                        </div>
                                    </div>

                                    <div className={styles.battleMid}>
                                        <div className={styles.opp}>
                                            <div className={styles.oppName}>
                                                {oppName} {oppTH ? <span className={styles.oppTh}>TH{oppTH}</span> : null}
                                            </div>
                                            <div className={styles.oppTag}>{oppTag}</div>
                                        </div>

                                        <div className={styles.lootRow}>
                                            <span className={styles.loot}>
                                                <img className={styles.lootIcon} src="/coc/icons/gold.png" alt="" aria-hidden="true" />
                                                {formatCompact(gold)}
                                            </span>
                                            <span className={styles.loot}>
                                                <img className={styles.lootIcon} src="/coc/icons/elixir.png" alt="" aria-hidden="true" />
                                                {formatCompact(elixir)}
                                            </span>
                                            <span className={styles.loot}>
                                                <img className={styles.lootIcon} src="/coc/icons/dark_elixir.png" alt="" aria-hidden="true" />
                                                {formatCompact(dark)}
                                            </span>
                                            {cap ? (
                                                <span className={styles.loot}>
                                                    <img className={styles.lootIcon} src="/coc/icons/capital_gold.png" alt="" aria-hidden="true" />
                                                    {formatCompact(cap)}
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>

                                    {b.armyShareCode ? (
                                        <div className={styles.battleBottom}>
                                            <button
                                                className={styles.copyBtn}
                                                onClick={() => navigator.clipboard.writeText(b.armyShareCode ?? "")}
                                                type="button"
                                            >
                                                Copier Army Share Code
                                            </button>
                                            <code className={styles.code}>{b.armyShareCode}</code>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}

                    {battleItems.length === 0 ? <div className={styles.empty}>Aucun combat.</div> : null}
                </div>
            </div>
        </section>
    );
}