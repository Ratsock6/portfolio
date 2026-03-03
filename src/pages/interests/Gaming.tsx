import { Link } from "react-router-dom";
import styles from "../../styles/gaming.module.css";
import { games } from "../../data/gaming";

const DEFAULT_LOGO = "/gaming/logos/default.png";

export default function Gaming() {
  // 🔧 Mets ton Twitch ici (login)
  const twitchUser = "ratsock6";

  return (
    <section className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.twitchTop}>
            <div>
              <h1 className={styles.title}>Jeux vidéos</h1>
              <p className={styles.sub}>
                Mes jeux principaux + pages dédiées (stats/infos/animations à venir).
              </p>
            </div>

            <a
              className={styles.twitchBtn}
              href={`https://www.twitch.tv/${twitchUser}`}
              target="_blank"
              rel="noreferrer"
            >
              Twitch.tv/{twitchUser} →
            </a>
          </div>

          <div className={styles.twitchCard}>
            <div className={styles.twitchBadge}>TWITCH</div>
            <div className={styles.twitchLine}>
              <span className={styles.twitchPrompt}>$</span>
              <span>
                live --channel <strong>{twitchUser}</strong>
              </span>
            </div>
            <div className={styles.twitchHint}>
              (plus tard : statut live + dernière VOD via backend YouTube/Twitch API)
            </div>
          </div>
        </div>
      </header>

      <h2 className={styles.sectionTitle}>Jeux principaux</h2>

      <div className={styles.grid}>
        {games.map((g) => (
          <Link
            key={g.slug}
            to={`/interests/gaming/${g.slug}`}
            className={styles.card}
            style={{ ["--accent" as any]: g.accent ?? "#9146FF" }}
          >
            <div className={styles.cardTop}>
              <img
                className={styles.logo}
                src={g.logo ?? DEFAULT_LOGO}
                alt={`${g.name} logo`}
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.src.endsWith(DEFAULT_LOGO)) return;
                  img.src = DEFAULT_LOGO;
                }}
              />

              <div className={styles.meta}>
                <div className={styles.name}>{g.name}</div>
                <div className={styles.since}>
                  {g.since ? `Depuis ${g.since}` : "Depuis ?"}
                </div>
              </div>
            </div>

            <div className={styles.cardBottom}>
              <span className={styles.cta}>Voir la page →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}