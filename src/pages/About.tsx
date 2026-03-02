import styles from "../styles/about.module.css";
import { Link } from "react-router-dom";
import Timeline from "../components/Timeline/Timeline";
import { timeline } from "../data/timeline";
import TimelineItem from "../components/Timeline/TimelineItem";

export default function About() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.hero}>
        <h1>antoine@portfolio:~$ cat about.txt</h1>
        <p>
          Passionné de programmation depuis l’adolescence, je conçois des
          projets techniques avec une approche structurée et orientée
          architecture.
        </p>
      </div>

      <div className={styles.block}>
        <h2>Présentation</h2>
        <p>
          Je développe depuis mes 15–16 ans, en commençant par Java en
          autodidacte. Très tôt, j’ai été attiré par la logique, la
          structuration du code et la construction de systèmes modulaires.
        </p>

        <p>
          Mon parcours m’a amené à travailler sur des projets variés :
          plugins Spigot, applications web modernes, projets systèmes et
          architectures orientées composants.
        </p>
      </div>

      <div className={styles.block}>
        <h2>Parcours</h2>
        <p>
          Un fil qui retrace mes études et mes expériences (jobs, projets, etc.).
        </p>
        <Timeline items={timeline} />
      </div>

      <div className={styles.block}>
        <h2>Compétences techniques</h2>

        <div className={styles.grid}>
          <div>
            <h3>Langages</h3>
            <ul>
              <li>Java</li>
              <li>TypeScript</li>
              <li>Python</li>
              <li>C / C++</li>
              <></>
            </ul>
          </div>

          <div>
            <h3>Frontend</h3>
            <ul>
              <li>React</li>
              <li>Vite</li>
              <li>CSS Modules</li>
            </ul>
          </div>

          <div>
            <h3>Systèmes / Backend</h3>
            <ul>
              <li>Node.js</li>
              <li>Spigot API</li>
              <li>Linux</li>
              <li>Git</li>
            </ul>
          </div>

        </div>
      </div>

      <div className={styles.block}>
        <h2>Centres d’intérêt</h2>
        <ul>
          <li>
            <Link to="/interests/chess">Échecs</Link>
          </li>
          <li>
            <Link to="/interests/f1">Formule 1</Link>
          </li>
          <li>
            <Link to="/interests/table-tennis">Tennis de table</Link>
          </li>
          <li>
            <Link to="/interests/gaming">Jeux vidéos</Link>
          </li>
          <li>
            <Link to="/interests/travel">Voyages</Link>
          </li>
        </ul>
      </div>
    </section>
  );
}