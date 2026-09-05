import { useRef, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useCart } from "../CartContext.tsx";
import { brand } from "../data/products.ts";
import { CartDrawer } from "./CartDrawer.tsx";
import { GrokHelp } from "./GrokHelp.tsx";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "The Maison" },
  { to: "/contact", label: "Contact" },
];

export function Layout() {
  const { count, setOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const taps = useRef(0);
  const tapTimer = useRef(0);

  function onWordmarkClick() {
    setMenuOpen(false);
    window.clearTimeout(tapTimer.current);
    taps.current += 1;
    if (taps.current >= 3) {
      taps.current = 0;
      window.dispatchEvent(new Event("maison-house"));
      return;
    }
    tapTimer.current = window.setTimeout(() => {
      taps.current = 0;
    }, 700);
  }

  return (
    <>
      <header className="site-header">
        <nav className="nav" aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? "active" : undefined)}
              end={link.to === "/"}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <NavLink className="wordmark" to="/" onClick={onWordmarkClick}>
          {brand.name}
        </NavLink>
        <div className="header-actions">
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </button>
          <button
            className="icon-btn"
            type="button"
            aria-label={count > 0 ? `Open bag, ${count} items` : "Open bag"}
            onClick={() => setOpen(true)}
          >
            Bag
            {count > 0 ? <span className="cart-count">{count}</span> : null}
          </button>
        </div>
        {menuOpen ? (
          <nav className="mobile-nav" aria-label="Mobile">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={() => setMenuOpen(false)}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        ) : null}
      </header>
      <div id="main">
        <Outlet />
      </div>
      <footer className="site-footer">
        <div className="wrap footer-grid">
          <div>
            <p className="eyebrow">Maison Indira</p>
            <h2 style={{ fontSize: "2.4rem", margin: "8px 0 12px" }}>{brand.tagline}</h2>
            <p>Cloud Nine — soft vanilla, warm musk, lavender. Handcrafted home fragrance.</p>
          </div>
          <div>
            <p className="eyebrow">Visit</p>
            <ul>
              <li>
                <a href={brand.phoneHref}>{brand.phone}</a>
              </li>
              <li>
                <a href={`mailto:${brand.email}`}>{brand.email}</a>
              </li>
              <li>
                <a href={brand.instagramUrl} target="_blank" rel="noreferrer">
                  Instagram @{brand.instagram}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="eyebrow">House</p>
            <ul>
              <li>
                <NavLink to="/shop">Shop the collection</NavLink>
              </li>
              <li>
                <NavLink to="/about">The maison</NavLink>
              </li>
              <li>
                <NavLink to="/returns">Returns</NavLink>
              </li>
              <li>
                <NavLink to="/contact">Write to us</NavLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="wrap legal">© {new Date().getFullYear()} Maison Indira. All rights reserved.</div>
      </footer>
      <CartDrawer />
      <GrokHelp />
    </>
  );
}
