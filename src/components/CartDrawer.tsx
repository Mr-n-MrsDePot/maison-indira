import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../CartContext.tsx";
import { formatMoney } from "../data/products.ts";
import { asset } from "../lib/asset.ts";
import { resolveLines } from "../lib/cart.ts";

export function CartDrawer() {
  const { open, setOpen, lines, total, setQty, checkout } = useCart();

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (!open) return null;
  const resolved = resolveLines(lines);

  return (
    <>
      <div className="drawer-backdrop" onClick={() => setOpen(false)} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Shopping bag">
        <header>
          <h2>Your bag</h2>
          <button className="icon-btn" type="button" onClick={() => setOpen(false)}>
            Close
          </button>
        </header>
        <div className="drawer-body">
          {resolved.length === 0 ? (
            <p className="empty">Your bag is empty. The house is waiting.</p>
          ) : (
            resolved.map(({ product, qty }) => (
              <div className="cart-line" key={product.slug}>
                <img src={asset(product.images[0])} alt="" />
                <div>
                  <h3>{product.shortName}</h3>
                  <p>{formatMoney(product.price)}</p>
                  <div className="qty">
                    <button type="button" onClick={() => setQty(product.slug, qty - 1)}>
                      −
                    </button>
                    <span>{qty}</span>
                    <button type="button" onClick={() => setQty(product.slug, qty + 1)}>
                      +
                    </button>
                  </div>
                </div>
                <strong>{formatMoney(product.price * qty)}</strong>
              </div>
            ))
          )}
        </div>
        <div className="drawer-foot" style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Total</span>
            <strong>{formatMoney(total)}</strong>
          </div>
          <button className="btn" type="button" disabled={resolved.length === 0} onClick={checkout}>
            Checkout
          </button>
          <Link className="btn ghost" to="/cart" onClick={() => setOpen(false)}>
            Review bag
          </Link>
        </div>
      </aside>
    </>
  );
}
