import styles from "../styles/about.module.css";

export default function About() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.block}>
        <h1>À propos du site</h1>
        <p>
          Ce site n’est pas uniquement un portfolio. Il représente un espace
          personnel structuré autour de mon évolution : mes projets
          techniques, mes centres d’intérêt, mon parcours et les éléments
          qui façonnent ma manière de penser et de construire.
        </p>
      </div>

      <div className={styles.block}>
        <h2>Contenu</h2>
        <ul>
          <li>Projets de développement</li>
          <li>Parcours et évolution</li>
          <li>Centres d’intérêt</li>
          <li>Expérimentations futures</li>
        </ul>
      </div>

      <div className={styles.block}>
        <h2>Architecture</h2>
        <p>
          Développé en React avec une architecture modulaire, le site combine
          du contenu Markdown et des pages dynamiques prêtes à intégrer des
          données backend. Il a été conçu pour évoluer dans le temps.
        </p>
      </div>

      <div className={styles.block}>
        <h2>Vision</h2>
        <p>
          Ce site est un espace vivant. Il évoluera avec mes projets,
          mes apprentissages et mes expériences. Il représente autant
          un laboratoire technique qu’une vitrine personnelle.
        </p>
      </div>
    </section>
  );
}