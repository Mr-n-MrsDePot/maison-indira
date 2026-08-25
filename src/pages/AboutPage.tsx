import { Link } from "react-router-dom";
import { brand } from "../data/products.ts";
import { asset } from "../lib/asset.ts";

export function AboutPage() {
  return (
    <main>
      <header className="page-hero wrap">
        <p className="eyebrow">The maison</p>
        <h1>A house for rooms, not runways.</h1>
        <p className="lede">
          Maison Indira makes home fragrance as if the room were the person you dress. One signature.
          Quiet luxury. Cloud Nine.
        </p>
      </header>
      <section className="split">
        <img src={asset("/images/oil-2.png")} alt="Cloud Nine fragrance oil" />
        <div className="split-copy">
          <p className="eyebrow">The scent</p>
          <h2>Cloud Nine</h2>
          <p>
            Soft vanilla, warm musk, and lavender — composed to feel like coming home: warmth without
            heaviness, calm without silence. It is the only scent in the house, on purpose. A maison
            is remembered for a signature, not a catalog.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="wrap prose">
          <h2>Not just fragrance. An experience.</h2>
          <p>
            The Shopify storefront was a beginning. This house is the brand as it should be met:
            photography of the actual objects, a collection you can read, and a bag that still
            checks out through the same store so orders, payments, and shipping stay where they
            already work.
          </p>
          <p>
            Every piece is handcrafted with care — oil in a 1 oz glass dropper with rose-gold
            detailing, a modern ceramic reed diffuser, and a boutique gift set packed to leave the
            house.
          </p>
          <p>
            Questions, wholesale, or a note for the atelier: write {brand.email} or call{" "}
            {brand.phone}. Follow the house on Instagram @{brand.instagram}.
          </p>
          <div className="btn-row">
            <Link className="btn" to="/shop">
              Shop Cloud Nine
            </Link>
            <Link className="btn ghost" to="/contact">
              Contact
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
