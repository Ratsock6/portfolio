import styles from "./Timeline.module.css";
import type { TimelineItem } from "../../data/timeline";

type Props = {
  items: TimelineItem[];
};

function formatPeriod(start: string, end?: string) {
  if (!end) return `${start} → présent`;
  if (start === end) return start;
  return `${start} → ${end}`;
}

export default function Timeline({ items }: Props) {
  return (
    <div className={styles.timeline} role="list" aria-label="Parcours">
      {items.map((it) => (
        <article key={it.id} className={styles.item} role="listitem">
          <div className={styles.left}>
            <div className={styles.dot} aria-hidden="true" />
            <div className={styles.line} aria-hidden="true" />
          </div>

          <div className={styles.card}>
            <div className={styles.meta}>
              <span className={styles.period}>{formatPeriod(it.start, it.end)}</span>
              <span className={styles.kind}>{it.kind}</span>
            </div>

            <img
          src={it.logo ?? "/logos/default.png"}
          alt="Logo"
          className={styles.logo}
        />

            <h3 className={styles.title}>{it.title}</h3>

            {(it.subtitle || it.location) && (
              <p className={styles.subtitle}>
                {it.subtitle ? it.subtitle : null}
                {it.subtitle && it.location ? " • " : null}
                {it.location ? it.location : null}
              </p>
            )}

            {it.bullets && it.bullets.length > 0 && (
              <ul className={styles.bullets}>
                {it.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}

            {it.tags && it.tags.length > 0 && (
              <div className={styles.tags} aria-label="Tags">
                {it.tags.map((t) => (
                  <span key={t} className={styles.tag}>
                    {t}
                  </span>
                ))}

              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}