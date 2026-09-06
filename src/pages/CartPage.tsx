import { Link } from "react-router-dom";
import { useCart } from "../CartContext.tsx";
import { formatMoney } from "../data/products.ts";
import { asset } from "../lib/asset.ts";
import { resolveLines } from "../lib/cart.ts";

export function CartPage() {
  const { lines, total, setQty, remove, checkout, checkoutBusy, checkoutError } = useCart();
  const resolved = resolveLines(lines);

  return (
    <main className="wrap" style={{ paddingBottom: 80 }}>
      <header className="page-hero">
        <p className="eyebrow">Bag</p>
        <h1>Your selection.</h1>
      </header>
      {resolved.length === 0 ? (
        <div className="empty">
          <p>Nothing in the bag yet.</p>
          <Link className="btn" to="/shop">
            Shop Cloud Nine
          </Link>
        </div>
      ) : (
        <div className="cart-page">
          <div className="cart-lines">
            {resolved.map(({ product, qty }) => (
              <article className="cart-line" key={product.slug}>
                <img src={asset(product.images[0])} alt="" />
                <div>
                  <h3>
                    <Link to={`/product/${product.slug}`}>{product.name}</Link>
                  </h3>
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
                  <button className="icon-btn" type="button" onClick={() => remove(product.slug)}>
                    Remove
                  </button>
                </div>
                <strong>{formatMoney(product.price * qty)}</strong>
              </article>
            ))}
          </div>
          <aside className="cart-summary">
            <p className="eyebrow">Checkout</p>
            <h2 style={{ fontSize: "2rem" }}>{formatMoney(total)}</h2>
            <p>
              Pay Maison Indira. Bag quantities and USPS shipping are set at checkout.
            </p>
            {checkoutError ? <p className="checkout-error">{checkoutError}</p> : null}
            <button
              className="btn"
              type="button"
              disabled={checkoutBusy}
              onClick={() => void checkout()}
            >
              {checkoutBusy ? "Opening checkout…" : "Continue to checkout"}
            </button>
            <Link className="btn ghost" to="/shop">
              Keep shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
