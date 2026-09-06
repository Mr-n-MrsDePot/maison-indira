import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../CartContext.tsx";
import { formatMoney } from "../data/products.ts";
import { resolveLines } from "../lib/cart.ts";
import { stripeCheckoutUrl } from "../lib/stripeLinks.ts";

function isLiveSessionUrl(url: string | undefined): url is string {
  return Boolean(url?.startsWith("https://checkout.stripe.com/") && url.includes("cs_live_"));
}

export function CheckoutPage() {
  const { lines, total } = useCart();
  const resolved = resolveLines(lines);
  const [mode, setMode] = useState<"loading" | "empty">("loading");
  const payUrl = stripeCheckoutUrl(lines);

  useEffect(() => {
    if (resolved.length === 0) {
      setMode("empty");
      return;
    }

    let cancelled = false;

    async function start() {
      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lines }),
        });
        const data = (await response.json()) as { url?: string };
        if (!cancelled && response.ok && isLiveSessionUrl(data.url)) {
          window.location.assign(data.url);
          return;
        }
      } catch {
        /* static hosts have no /api/checkout */
      }
      if (!cancelled) window.location.assign(payUrl);
    }

    void start();
    return () => {
      cancelled = true;
    };
  }, [lines, payUrl, resolved.length]);

  if (mode === "empty") {
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
