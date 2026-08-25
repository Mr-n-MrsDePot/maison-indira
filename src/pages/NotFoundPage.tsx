import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="wrap empty">
      <p className="eyebrow">404</p>
      <h1>This page has left the house.</h1>
      <p>The collection is still here.</p>
      <Link className="btn" to="/shop">
        Continue shopping
      </Link>
    </main>
  );
}
