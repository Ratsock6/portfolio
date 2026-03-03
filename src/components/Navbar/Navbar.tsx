import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

type Props = {
  theme: "dark" | "light";
  onToggleTheme: () => void;
};

export default function Navbar({ theme, onToggleTheme }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.brand}>
          Antoine
        </NavLink>

        <div className={styles.right}>
          <nav className={styles.nav} aria-label="Navigation principale">
            <NavLink
              to="/presentation"
              className={({ isActive }) =>
                isActive ? styles.active : styles.link
              }
            >
              Presentation
            </NavLink>
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                isActive ? styles.active : styles.link
              }
            >
              Projets
            </NavLink>
            <NavLink
              to="/dev-projects"
              className={({ isActive }) =>
                isActive ? styles.active : styles.link
              }
            >
              Dev perso
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? styles.active : styles.link
              }
            >
              À propos
            </NavLink>
          </nav>

          <button
            type="button"
            className={styles.themeBtn}
            onClick={onToggleTheme}
            aria-label="Changer le thème"
            title="Changer le thème"
          >
            {theme === "dark" ? "☾" : "☀"}
          </button>
        </div>
      </div>
    </header>
  );
}