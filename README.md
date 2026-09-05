# Maison Indira

Independent luxury home-fragrance website. Catalog is Cloud Nine. **Payments go through Stripe**, not Shopify.

**Tagline:** Not just fragrance. An experience.

## Run

```text
cd D:\SystemHub\Projects\Active\maison-indira
copy .env.example .env
```

Checkout on the public site uses **Stripe Payment Links**. You do **not** put a secret key in the website for that. Optional: for local `/api/checkout` only, copy `.env.example` to `.env` and add `STRIPE_SECRET_KEY`.

```text
npm install
npm run dev
```

Open [http://localhost:5222](http://localhost:5222). Checkout opens Stripe.

```text
npm test
npm run build
```

## Payments (Stripe, not Shopify)

Card fee is Stripe’s US rate: **2.9% + $0.30** per successful charge. No Shopify monthly plan. No extra Shopify transaction cut.

Example: a **$40** diffuser is about **$1.46** to Stripe. On Shopify Basic that same card fee still happens, plus **~$29/month**.

Live catalog already checks out through Payment Links (oil $15, diffuser $40, gift $25). A secret key is only for the optional Vercel `/api/checkout` path.

## Go live

1. Buy **maisonindira.com** (~$11/year at [Porkbun](https://porkbun.com/checkout/search?q=maisonindira.com)).
2. Import this repo into [Vercel](https://vercel.com) (Vite, output `dist`).
3. Add env vars: `STRIPE_SECRET_KEY`, `SITE_URL=https://maisonindira.com`.
4. Point the domain at Vercel.

Orders, receipts, and payouts are in the Stripe Dashboard. She still packs and ships.

Shipping at checkout: USPS Ground **$6.95**, USPS Priority **$12.95** (edit `src/data/shipping.ts`).

## Contact

- Phone: (732) 397-3299
- Email: MaisonIndira9@gmail.com
- Instagram: [@MaisonIndira_](https://www.instagram.com/maisonindira_/)
