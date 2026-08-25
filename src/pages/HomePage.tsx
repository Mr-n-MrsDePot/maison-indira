import { Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard.tsx";
import { brand, products } from "../data/products.ts";
import { asset } from "../lib/asset.ts";

const notes = [
  {
    name: "Soft vanilla",
    copy: "Warm, rounded, and quietly sweet — the first impression of Cloud Nine.",
  },
  {
    name: "Warm musk",
    copy: "A skin-close softness that makes the room feel lived in, not sprayed on.",
  },
  {
    name: "Lavender",
    copy: "A clean lift. The note that turns comfort into calm.",
  },
];

export function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Home fragrance house</p>
          <h1>Cloud Nine, at home.</h1>
          <p>
            Maison Indira composes rooms the way a perfume house composes a signature. One scent —
            vanilla, musk, lavender — in oil, in ceramic, in a gift ready to leave the house.
          </p>
          <div className="btn-row">
            <Link className="btn" to="/shop">
              Shop the collection
            </Link>
            <Link className="btn ghost" to="/about">
              The maison
            </Link>
          </div>
        </div>
        <div className="hero-media">
          <img src={asset("/images/diffuser-1.jpg")} alt="Maison Indira Cloud Nine reed diffuser and oil" />
          <span className="hero-caption">{brand.tagline}</span>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i}>Soft vanilla · Warm musk · Lavender · Maison Indira · Cloud Nine ·</span>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">The collection</p>
              <h2>Three ways to wear Cloud Nine.</h2>
            </div>
            <Link className="btn ghost" to="/shop">
              View all
            </Link>
          </div>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="split">
        <img src={asset("/images/gift-2.png")} alt="Cloud Nine glass diffuser and fragrance oil" />
        <div className="split-copy">
          <p className="eyebrow">The object</p>
          <h2>A diffuser that belongs on the table.</h2>
          <p className="lede">
            Clean ceramic. Quiet presence. The Cloud Nine modern reed diffuser is made to sit in an
            entryway or beside the bed — décor first, then atmosphere.
          </p>
          <Link className="btn" to="/product/cloud-nine-diffuser">
            The reed diffuser
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">The composition</p>
              <h2>Three notes. One mood.</h2>
              <p>The house scent is Cloud Nine — written for rooms, not wrists.</p>
            </div>
          </div>
          <div className="notes">
            {notes.map((note) => (
              <article className="note" key={note.name}>
                <p className="eyebrow">Note</p>
                <h3>{note.name}</h3>
                <p>{note.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section tight" style={{ background: "var(--ivory)" }}>
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">The ritual</p>
              <h2>How to scent a room.</h2>
            </div>
          </div>
          <div className="ritual">
            <article>
              <span>01</span>
              <h3>Place the vessel</h3>
              <p>Choose the room you return to. Bedrooms, baths, desks, and entries all hold Cloud Nine well.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Dress the reeds</h3>
              <p>Pour the oil, set the sticks, and turn them once the first evening so the scent can bloom.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Let it linger</h3>
              <p>A quiet, lasting atmosphere — warmth without noise. Refill with the 1 oz oil when the room asks.</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
