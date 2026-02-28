import { Link, useParams } from "react-router-dom";
import { devProjects } from "../data/devProjects";
import Markdown from "../components/Markdown/Markdown";
import styles from "../styles/detail.module.css";

export default function DevProjectDetail() {
  const { slug } = useParams();
  const item = devProjects.find((p) => p.slug === slug);

  if (!item) {
    return (
      <section>
        <h1>Projet introuvable</h1>
        <Link to="/dev-projects">Retour</Link>
      </section>
    );
  }

  const md = item.contentMd ?? item.longDescription ?? "";

  return (
    <section>
      <Link className={styles.back} to="/dev-projects">
        ← Retour
      </Link>

      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1 style={{ margin: 0 }}>{item.title}</h1>
          <div className={styles.period}>{item.period}</div>
        </div>

        {item.media?.image && (
          <div className={styles.hero}>
            <img src={item.media.image} alt={item.media.alt ?? item.title} />
          </div>
        )}
      </header>

      <div className={styles.layout}>
        <div>
          {md && <Markdown content={md} />}

          <h2>Points clés</h2>
          <ul>
            {item.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>

        <aside className={styles.sidebar} aria-label="Infos projet">
          <div className={styles.kv}>
            <div className={styles.kvItem}>
              <strong>Rôle</strong>
              <span>{item.role}</span>
            </div>

            <div className={styles.kvItem}>
              <strong>Tags</strong>
              <div className={styles.tags}>
                {item.tags.map((t) => (
                  <span className={styles.tag} key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {item.links && item.links.length > 0 && (
              <div className={styles.links}>
                {item.links.map((l) => (
                  <a
                    key={l.url}
                    className={styles.linkBtn}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {l.label} →
                  </a>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}