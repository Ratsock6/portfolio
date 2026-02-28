import styles from "./TagFilter.module.css";

type Props = {
  tags: string[];
  selected: string | null;
  onSelect: (tag: string | null) => void;
};

export default function TagFilter({ tags, selected, onSelect }: Props) {
  if (tags.length === 0) return null;

  return (
    <div className={styles.row} aria-label="Filtrer par tag">
      <button
        type="button"
        className={selected === null ? styles.active : styles.btn}
        onClick={() => onSelect(null)}
      >
        Tous
      </button>

      {tags.map((t) => (
        <button
          key={t}
          type="button"
          className={selected === t ? styles.active : styles.btn}
          onClick={() => onSelect(t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}