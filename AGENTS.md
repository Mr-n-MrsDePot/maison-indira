# Maison Indira

Independent brand site. Checkout is **Stripe**, not Shopify.

- Catalog and prices: `src/data/products.ts`
- Shipping rates: `src/data/shipping.ts`
- Secret key only in `.env` / Vercel as `STRIPE_SECRET_KEY`. Never put it in client code.
- Port 5222. Node 24.15.0.
- Melco / AI-FORBIDDEN paths are out of scope.
