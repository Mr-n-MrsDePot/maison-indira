import { useState, type FormEvent } from "react";
import { brand } from "../data/products.ts";

export function ContactPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const comment = String(data.get("comment") ?? "").trim();
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : "",
      "",
      comment,
    ]
      .filter(Boolean)
      .join("\n");
    const href = `mailto:${brand.email}?subject=${encodeURIComponent("Maison Indira inquiry")}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    setSent(true);
  }

  return (
    <main className="wrap" style={{ paddingBottom: 80 }}>
      <header className="page-hero">
        <p className="eyebrow">Contact</p>
        <h1>Write to the house.</h1>
        <p className="lede">Orders, gifting, and the atelier — we read every note.</p>
      </header>
      <div className="contact-grid">
        <form className="form" onSubmit={onSubmit}>
          <label>
            Name
            <input name="name" autoComplete="name" />
          </label>
          <label>
            Email
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <label>
            Phone
            <input name="phone" type="tel" autoComplete="tel" />
          </label>
          <label>
            Note
            <textarea name="comment" required />
          </label>
          <button className="btn" type="submit">
            Send
          </button>
          {sent ? <p>Your mail app should open with the note addressed to {brand.email}.</p> : null}
        </form>
        <div className="contact-card">
          <p className="eyebrow">Direct</p>
          <h2 style={{ fontSize: "2.4rem" }}>Atelier</h2>
          <p>
            Phone: <a href={brand.phoneHref}>{brand.phone}</a>
          </p>
          <p>
            Email: <a href={`mailto:${brand.email}`}>{brand.email}</a>
          </p>
          <p>
            Instagram:{" "}
            <a href={brand.instagramUrl} target="_blank" rel="noreferrer">
              @{brand.instagram}
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
