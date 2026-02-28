import styles from "./SearchBar.module.css";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChange, placeholder }: Props) {
  return (
    <div className={styles.wrap}>
      <input
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Rechercher..."}
        aria-label="Rechercher"
      />
    </div>
  );
}