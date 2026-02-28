import { isRouteErrorResponse, useRouteError, Link } from "react-router-dom";

export default function RouteError() {
  const err = useRouteError();

  let title = "Erreur";
  let message = "Une erreur est survenue.";

  if (isRouteErrorResponse(err)) {
    title = `Erreur ${err.status}`;
    message = err.statusText || message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  return (
    <section>
      <h1>{title}</h1>
      <p>{message}</p>

      {/* utile pendant le debug */}
      <pre style={{ whiteSpace: "pre-wrap", color: "var(--muted)" }}>
        {JSON.stringify(err, null, 2)}
      </pre>

      <Link to="/">Retour à l’accueil</Link>
    </section>
  );
}