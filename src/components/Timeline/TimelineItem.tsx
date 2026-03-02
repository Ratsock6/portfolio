import styles from "./Timeline.module.css";

type Props = {
  date: string;
  title: string;
  description: string;
  logo?: string;
  logoAlt?: string;
};

const DEFAULT_LOGO = "/logos/default.png";

export default function TimelineItem({
  date,
  title,
  description,
  logo,
  logoAlt,
}: Props) {
  return (
    <div className={styles.item}>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.date}>{date}</span>
          <h3>{title}</h3>
        </div>

        <p>{description}</p>

        <img
          src={logo ?? DEFAULT_LOGO}
          alt={logoAlt ?? "Logo"}
          className={styles.logo}
          onError={(e) => {
            const img = e.currentTarget;
            if (img.src.endsWith(DEFAULT_LOGO)) return;
            img.src = DEFAULT_LOGO;
          }}
        />
      </div>
    </div>
  );
}