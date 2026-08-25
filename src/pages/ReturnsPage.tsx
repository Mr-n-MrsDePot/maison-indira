import { brand } from "../data/products.ts";

export function ReturnsPage() {
  return (
    <main className="wrap prose" style={{ paddingBottom: 80 }}>
      <header className="page-hero">
        <p className="eyebrow">Care</p>
        <h1>Returns.</h1>
      </header>
      <p>
        Contact us at <a href={`mailto:${brand.email}`}>{brand.email}</a> to start a return. Items
        sent back without a request first are not accepted.
      </p>
      <h2>Window</h2>
      <p>
        Returns are considered within 14 days of delivery and are honored as store credit. The item
        must be unused and in the condition it arrived, with proof of purchase.
      </p>
      <h2>Damages</h2>
      <p>
        Please inspect the order when it arrives. If something is defective, damaged, or incorrect,
        write immediately so we can make it right.
      </p>
      <h2>What we cannot take back</h2>
      <p>
        Used fragrance, gift cards, custom orders, and hazardous or flammable goods are not
        returnable. If you are unsure, ask before sending anything. The current collection is on
        a house sale; unused pieces in original condition still qualify within the window.
      </p>
      <h2>Refunds</h2>
      <p>
        When a return is approved as store credit, we will confirm after inspecting the piece. For
        questions after that, write {brand.email}.
      </p>
    </main>
  );
}
