import { Link } from "react-router-dom";
import { formatMoney, type Product } from "../data/products.ts";
import { asset } from "../lib/asset.ts";

export function ProductCard({ product }: { product: Product }) {
  const onSale = product.compareAt && product.compareAt > product.price;
  return (
    <article className="product-card">
      <Link className="media" to={`/product/${product.slug}`}>
        {onSale ? <span className="badge">Sale</span> : null}
        <img src={asset(product.images[0])} alt={product.name} />
      </Link>
      <div>
        <p className="eyebrow">{product.category}</p>
        <h3>
          <Link to={`/product/${product.slug}`}>{product.shortName}</Link>
        </h3>
        <div className="meta">
          <span>{product.tagline}</span>
          <span className="price">
            {onSale ? <s>{formatMoney(product.compareAt ?? 0)}</s> : null}
            {formatMoney(product.price)}
          </span>
        </div>
      </div>
    </article>
  );
}
