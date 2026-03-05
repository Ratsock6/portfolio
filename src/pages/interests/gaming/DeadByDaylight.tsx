import { useEffect, useMemo, useState } from "react";
import styles from "../../../styles/dbdPage.module.css";
import { formatNumber } from "../../../utils/formatNumber";
import { getDbdCategory, getDbdLabel, isNoiseStat, sortByMeta } from "../../../utils/dbdStats";
import { formatDbdValue } from "../../../utils/formatDbdValue";

type DbdApi = {
    updatedAt: string | null;
    profile: {
        steamid: string;
        personaname: string;
        avatar: string | null;
        profileurl: string | null;
        personastate: number | null;
    } | null;
    playtime: {
        appid: number;
        name: string;
        minutes: number;
        hours: number;
        icon: string | null;
        logo: string | null;
    } | null;
    stats: Array<{ name: string; value: number }>;
    achievements: {
        unlocked: Array<{
            apiName: string;
            achieved: boolean;
            unlockTime: number | null;
            displayName: string | null;
            description: string | null;
            icon: string | null;
            icongray: string | null;
            hidden: number;
        }>;
        total: number | null;
        unlockedCount: number | null;
        percent: number | null;
    };
    schema: {
        achievements: Array<{
            name: string;
            displayName: string;
            description: string;
            hidden: number;
            icon: string;
            icongray: string;
        }>;
    };
};

function fmtUpdatedAt(s: string | null) {
    if (!s) return "—";
    const d = new Date(s);
    return isNaN(d.getTime()) ? s : d.toLocaleString("fr-FR");
}

function fmtUnlockTime(t: number | null) {
    if (!t) return "";
    const d = new Date(t * 1000);
    return isNaN(d.getTime())
        ? ""
        : d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function DeadByDaylightPage() {
    const [data, setData] = useState<DbdApi | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function run() {
            setLoading(true);
            const d = await fetch("/api/dbd").then((r) => r.json());
            setData(d);
            setLoading(false);
        }
        run().catch((e) => {
            console.error("DBD load failed", e);
            setLoading(false);
        });
    }, []);

    const profile = data?.profile ?? null;

    const lockedSuggestions = useMemo(() => {
        const all = data?.schema?.achievements ?? [];
        const unlockedSet = new Set((data?.achievements?.unlocked ?? []).map((a) => a.apiName));
        return all
            .filter((a) => !unlockedSet.has(a.name))
            .slice(0, 10)
            .map((a) => ({
                apiName: a.name,
                displayName: a.displayName ?? a.name,
                description: a.description ?? "",
                icon: a.icongray ?? a.icon ?? null,
            }));
    }, [data]);

    // ---- Stats separation (Survivor / Killer / Progression) ----
    const { survivorStats, killerStats, progStats } = useMemo(() => {
        const allStats = data?.stats ?? [];
        const filtered = allStats.filter((s) => !isNoiseStat(s.name));

        const survivor = filtered
            .filter((s) => getDbdCategory(s.name) === "survivor" && s.value !== 0)
            .sort((a, b) => sortByMeta(a.name, b.name))
            .slice(0, 10);

        const killer = filtered
            .filter((s) => getDbdCategory(s.name) === "killer" && s.value !== 0)
            .sort((a, b) => sortByMeta(a.name, b.name))
            .slice(0, 10);

        const progression = filtered
            .filter((s) => getDbdCategory(s.name) === "progression" && s.value !== 0)
            .sort((a, b) => sortByMeta(a.name, b.name))
            .slice(0, 8);

        return { survivorStats: survivor, killerStats: killer, progStats: progression };
    }, [data]);

    if (loading) return <p>Chargement…</p>;
    if (!data || !profile) return <p>Impossible de charger Dead by Daylight.</p>;

    return (
        <section className={styles.page}>
            <header className={styles.hero}>
                <div className={styles.heroLeft}>
                    <div className={styles.heroTop}>
                        {profile.avatar ? (
                            <img className={styles.avatar} src={profile.avatar} alt={profile.personaname} />
                        ) : (
                            <div className={styles.avatarFallback} />
                        )}

                        <div className={styles.heroIdentity}>
                            <h1 className={styles.title}>Dead by Daylight</h1>
                            <div className={styles.playerName}>{profile.personaname}</div>
                            <div className={styles.metaLine}>
                                <span>MAJ {fmtUpdatedAt(data.updatedAt)}</span>
                                {profile.profileurl ? (
                                    <>
                                        <span className={styles.dot}>•</span>
                                        <a className={styles.link} href={profile.profileurl} target="_blank" rel="noreferrer">
                                            Voir le profil Steam
                                        </a>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <div className={styles.kpis}>
                        <div className={styles.kpi}>
                            <div className={styles.kpiLabel}>Temps de jeu</div>
                            <div className={styles.kpiValue}>{data.playtime?.hours ?? "—"} h</div>
                            <div className={styles.kpiSub}>{formatNumber(data.playtime?.minutes ?? 0)} min</div>
                        </div>

                        <div className={styles.kpi}>
                            <div className={styles.kpiLabel}>Succès</div>
                            <div className={styles.kpiValue}>
                                {data.achievements.unlockedCount ?? "—"} / {data.achievements.total ?? "—"}
                            </div>
                            <div className={styles.kpiSub}>{data.achievements.percent ?? "—"}%</div>
                        </div>
                    </div>

                    <div className={styles.progressWrap}>
                        <div className={styles.progressTop}>
                            <span>Progression</span>
                            <strong>{data.achievements.percent ?? 0}%</strong>
                        </div>

                        <div className={styles.progressBar}>
                            <div
                                className={styles.progressFill}
                                style={{
                                    width: `${Math.max(0, Math.min(100, data.achievements.percent ?? 0))}%`,
                                }}
                            />
                        </div>

                        {/* Stats under the progress bar */}
                        <div className={styles.statsSection}>
                            <div>
                                <h3 className={styles.statsTitle}>Survivor</h3>
                                <div className={styles.inlineStats}>
                                    {survivorStats.map((s) => (
                                        <div key={s.name} className={styles.inlineStat}>
                                            <div className={styles.inlineStatValue} title={String(s.value)}>
                                                {formatDbdValue(s.name, s.value)}
                                            </div>
                                            <div className={styles.inlineStatName} title={s.name}>
                                                {getDbdLabel(s.name)}
                                            </div>
                                        </div>
                                    ))}
                                    {survivorStats.length === 0 ? (
                                        <div className={styles.empty}>Aucune stat Survivor notable.</div>
                                    ) : null}
                                </div>
                            </div>

                            <div>
                                <h3 className={styles.statsTitle}>Killer</h3>
                                <div className={styles.inlineStats}>
                                    {killerStats.map((s) => (
                                        <div key={s.name} className={styles.inlineStat}>
                                            <div className={styles.inlineStatValue} title={String(s.value)}>
                                                {formatDbdValue(s.name, s.value)}
                                            </div>
                                            <div className={styles.inlineStatName} title={s.name}>
                                                {getDbdLabel(s.name)}
                                            </div>
                                        </div>
                                    ))}
                                    {killerStats.length === 0 ? (
                                        <div className={styles.empty}>Aucune stat Killer notable.</div>
                                    ) : null}
                                </div>
                            </div>

                            <div>
                                <h3 className={styles.statsTitle}>Progression</h3>
                                <div className={styles.inlineStats}>
                                    {progStats.map((s) => (
                                        <div key={s.name} className={styles.inlineStat}>
                                            <div className={styles.inlineStatValue} title={String(s.value)}>
                                                {formatDbdValue(s.name, s.value)}
                                            </div>
                                            <div className={styles.inlineStatName} title={s.name}>
                                                {getDbdLabel(s.name)}
                                            </div>
                                        </div>
                                    ))}
                                    {progStats.length === 0 ? (
                                        <div className={styles.empty}>Aucune stat de progression.</div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.heroRight}>
                    <div className={styles.panel}>
                        <div className={styles.panelTitle}>Derniers succès débloqués</div>

                        <div className={styles.achList}>
                            {(data.achievements.unlocked ?? []).slice(0, 8).map((a) => (
                                <div key={a.apiName} className={styles.achItem}>
                                    {a.icon ? (
                                        <img className={styles.achIcon} src={a.icon} alt={a.displayName ?? a.apiName} />
                                    ) : (
                                        <div className={styles.achIconFallback} />
                                    )}

                                    <div className={styles.achText}>
                                        <div className={styles.achName}>{a.displayName ?? a.apiName}</div>
                                        <div className={styles.achDesc}>
                                            {a.description ?? ""}
                                            {a.unlockTime ? <span className={styles.achTime}> · {fmtUnlockTime(a.unlockTime)}</span> : null}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {(data.achievements.unlocked ?? []).length === 0 ? (
                                <div className={styles.empty}>Aucun succès récupéré via Steam.</div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </header>

            <div className={styles.grid}>
                <div className={styles.panel}>
                    <div className={styles.panelTitle}>Succès à débloquer (suggestions)</div>

                    <div className={styles.achGrid}>
                        {lockedSuggestions.map((a) => (
                            <div key={a.apiName} className={styles.lockedCard}>
                                {a.icon ? (
                                    <img className={styles.lockedIcon} src={a.icon} alt={a.displayName} />
                                ) : (
                                    <div className={styles.lockedIconFallback} />
                                )}
                                <div className={styles.lockedText}>
                                    <div className={styles.lockedName}>{a.displayName}</div>
                                    <div className={styles.lockedDesc}>{a.description}</div>
                                </div>
                            </div>
                        ))}

                        {lockedSuggestions.length === 0 ? <div className={styles.empty}>Rien à suggérer.</div> : null}
                    </div>
                </div>
            </div>
        </section>
    );
}