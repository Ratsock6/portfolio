import { Link } from "react-router-dom";
import styles from "./ProjectCard.module.css";
import type { BaseItem } from "../../data/types";

type Props = {
  item: BaseItem;
  to: string;
};

const DEFAULT_LOGO = "/logos/default.png";

export default function ProjectCard({ item, to }: Props) {
  const logoSrc = item.logo?.src ?? DEFAULT_LOGO;
  const logoAlt = item.logo?.alt ?? "Logo";

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <div className={styles.titleBlock}>
          <img
            className={styles.logo}
            src={logoSrc}
            alt={logoAlt}
            loading="lazy"
            onError={(e) => {
              const img = e.currentTarget;
              if (img.src.endsWith(DEFAULT_LOGO)) return;
              img.src = DEFAULT_LOGO;
            }}
          />

          <div>
            <h2 className={styles.title}>
              <Link className={styles.titleLink} to={to}>
                {item.title}
              </Link>
            </h2>
            <div className={styles.period}>{item.period}</div>
          </div>
        </div>
      </div>

      <p className={styles.desc}>{item.shortDescription}</p>

      <div className={styles.tags} aria-label="Tags">
        {item.tags.slice(0, 6).map((t) => (
          <span key={t} className={styles.tag}>
            {t}
          </span>
        ))}
      </div>

      <div className={styles.bottom}>
        <div className={styles.role}>{item.role}</div>
        <Link className={styles.cta} to={to}>
          Voir →
        </Link>
      </div>
    </article>
  );
}