import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "../CartContext.tsx";
import { formatMoney } from "../data/products.ts";
import { resolveLines } from "../lib/cart.ts";
import { stripeCheckoutUrl } from "../lib/stripeLinks.ts";

type CheckoutStart = {
  clientSecret?: string;
  publishableKey?: string;
  error?: string;
};

export function CheckoutPage() {
  const { lines, total } = useCart();
  const resolved = resolveLines(lines);
  const mountRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"loading" | "embedded" | "empty">("loading");

  useEffect(() => {
    if (resolved.length === 0) {
      setMode("empty");
      return;
    }

    let cancelled = false;
    let destroy: (() => void) | undefined;

    async function start() {
      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lines }),
        });
        const data = (await response.json()) as CheckoutStart;
        if (
          cancelled ||
          !response.ok ||
          !data.clientSecret ||
          !data.publishableKey?.startsWith("pk_live_")
        ) {
          if (!cancelled) window.location.assign(stripeCheckoutUrl(lines));
          return;
        }
        const stripe = await loadStripe(data.publishableKey);
        if (!stripe || cancelled || !mountRef.current) {
          if (!cancelled) window.location.assign(stripeCheckoutUrl(lines));
          return;
        }
        const checkout = await stripe.initEmbeddedCheckout({
          clientSecret: data.clientSecret,
        });
        if (cancelled) {
          checkout.destroy();
          return;
        }
        checkout.mount(mountRef.current);
        destroy = () => checkout.destroy();
        setMode("embedded");
      } catch {
        if (!cancelled) window.location.assign(stripeCheckoutUrl(lines));
      }
    }

    void start();
    return () => {
      cancelled = true;
      destroy?.();
    };
  }, [lines, resolved.length]);

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
        <h1>Stay with the house.</h1>
        <p className="lede">
          Pay on this page. Money goes to Maison Indira. Total {formatMoney(total)}.
        </p>
      </header>
      <div ref={mountRef} className="checkout-embed" />
    </main>
  );
}
