import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../CartContext.tsx";
import { ProductCard } from "../components/ProductCard.tsx";
import { formatMoney, getProduct, products } from "../data/products.ts";
import { asset } from "../lib/asset.ts";

export function ProductPage() {
  const { slug = "" } = useParams();
  const product = getProduct(slug);
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  useEffect(() => {
    setQty(1);
    setActive(0);
  }, [slug]);
  const related = useMemo(
    () => products.filter((item) => item.slug !== slug).slice(0, 3),
    [slug],
  );

  if (!product) {
    return (
      <main className="wrap empty">
        <h1>This piece is not in the house.</h1>
        <p>
          <Link to="/shop">Return to the collection</Link>
        </p>
      </main>
    );
  }

  const onSale = product.compareAt && product.compareAt > product.price;

  return (
    <main>
      <div className="wrap product-layout">
        <div className="gallery">
          <div className="gallery-main">
            <img src={asset(product.images[active] ?? product.images[0])} alt={product.name} />
          </div>
          <div className="thumbs">
            {product.images.map((src, index) => (
              <button
                key={src}
                type="button"
                className={index === active ? "active" : undefined}
                onClick={() => setActive(index)}
                aria-label={`View image ${index + 1}`}
              >
                <img src={asset(src)} alt="" />
              </button>
            ))}
          </div>
        </div>
        <div className="product-info">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="price" style={{ fontSize: "1.2rem" }}>
            {onSale ? <s>{formatMoney(product.compareAt ?? 0)}</s> : null}
            {formatMoney(product.price)}
          </p>
          <p>{product.description}</p>
          <div className="panel">
            <p className="eyebrow">Fragrance notes</p>
            <p>{product.notes.join(" · ")}</p>
          </div>
          <div className="btn-row">
            <div className="qty" aria-label="Quantity">
              <button type="button" onClick={() => setQty((n) => Math.max(1, n - 1))}>
                −
              </button>
              <span>{qty}</span>
              <button type="button" onClick={() => setQty((n) => n + 1)}>
                +
              </button>
            </div>
            <button className="btn" type="button" onClick={() => add(product.slug, qty)}>
              Add to bag
            </button>
          </div>
          <div className="panel">
            <p className="eyebrow">Includes</p>
            <ul className="includes">
              {product.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="panel">
            <p className="eyebrow">Details</p>
            <ul className="details-list">
              {product.details.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <section className="section tight">
        <div className="wrap">
          <div className="section-head">
            <h2>You may also love</h2>
          </div>
          <div className="product-grid">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
