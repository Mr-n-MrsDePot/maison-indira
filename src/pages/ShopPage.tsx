import { ProductCard } from "../components/ProductCard.tsx";
import { products } from "../data/products.ts";

export function ShopPage() {
  return (
    <main className="wrap">
      <header className="page-hero">
        <p className="eyebrow">Shop</p>
        <h1>The collection.</h1>
        <p className="lede">
          One signature scent, three forms: oil for the house you already love, a ceramic diffuser
          that belongs on the table, and a gift set ready to leave in someone else’s care.
        </p>
      </header>
      <div className="product-grid" style={{ paddingBottom: 80 }}>
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </main>
  );
}
