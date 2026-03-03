import { Link, useParams } from "react-router-dom";
import { games } from "../../data/gaming";

export default function GameDetail() {
  const { slug } = useParams();
  const game = games.find((g) => g.slug === slug);

  if (!game) {
    return (
      <section>
        <h1>Jeu introuvable</h1>
        <Link to="/interests/gaming">Retour</Link>
      </section>
    );
  }

  return (
    <section>
      <Link to="/interests/gaming">← Retour</Link>
      <h1>{game.name}</h1>
      <p>Page dédiée (backend + animations à venir).</p>
    </section>
  );
}