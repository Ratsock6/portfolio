import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import styles from "../styles/sectionThemeLayout.module.css";

type Props = {
  themeClass: string;
};

export default function SectionThemeLayout({ themeClass }: Props) {
  useEffect(() => {
    const el = document.documentElement;
    el.classList.add(themeClass);
    return () => el.classList.remove(themeClass);
  }, [themeClass]);

  return (
    <div className={styles.content}>
      <Outlet />
    </div>
  );
}