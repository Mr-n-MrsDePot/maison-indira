import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../CartContext.tsx";
import { formatMoney } from "../data/products.ts";
import { resolveLines } from "../lib/cart.ts";
import { stripeCheckoutUrl } from "../lib/stripeLinks.ts";

export function CheckoutPage() {
  const { lines, total } = useCart();
  const resolved = resolveLines(lines);
  const payUrl = stripeCheckoutUrl(lines);

  useEffect(() => {
    if (resolved.length === 0) return;
    window.location.assign(payUrl);
  }, [payUrl, resolved.length]);

  if (resolved.length === 0) {
    return (
      <main className="wrap empty">
        <p className="eyebrow">Checkout</p>
        <h1>Your bag is empty.</h1>
        <Link className="btn" to="/shop">
          Shop Cloud Nine
        </Link>
      </main>
    );
  }

  return (
    <main className="wrap checkout-page">
      <header className="page-hero">
        <p className="eyebrow">Checkout</p>
        <h1>Opening Maison Indira pay.</h1>
        <p className="lede">
          Your bag, then shipping. Total {formatMoney(total)} before shipping.
        </p>
      </header>
      <p>
        <a className="btn" href={payUrl}>
          Continue to pay
        </a>
      </p>
    </main>
  );
}
