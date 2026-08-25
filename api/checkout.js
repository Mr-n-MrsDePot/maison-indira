const CATALOG = {
  "cloud-nine-oil": { name: "Cloud Nine Home Fragrance Oil", cents: 1500 },
  "cloud-nine-diffuser": { name: "Cloud Nine Modern Reed Diffuser", cents: 4000 },
  "boutique-gift-set": { name: "Boutique Luxury Diffuser Gift Set", cents: 2500 },
};

const SHIPPING = [
  { name: "USPS Ground", cents: 695 },
  { name: "USPS Priority", cents: 1295 },
];

function originFrom(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "maison-indira.vercel.app";
  return `${proto}://${host}`;
}

function lineItems(rawLines) {
  if (!Array.isArray(rawLines)) return [];
  return rawLines.flatMap((line) => {
    const slug = typeof line?.slug === "string" ? line.slug : "";
    const qty = Math.min(99, Math.max(0, Math.floor(Number(line?.qty))));
    const product = CATALOG[slug];
    if (!product || qty <= 0) return [];
    return [{ name: product.name, cents: product.cents, qty }];
  });
}

function append(body, key, value) {
  body.append(key, value);
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST only" });
    return;
  }

  const secret = (process.env.STRIPE_SECRET_KEY || "").trim();
  const items = lineItems(req.body?.lines);
  if (items.length === 0) {
    res.status(400).json({ error: "Your bag is empty." });
    return;
  }
  if (!secret) {
    res.status(503).json({
      error: "Stripe is not connected yet. Add STRIPE_SECRET_KEY in Vercel.",
    });
    return;
  }

  const origin = originFrom(req);
  const body = new URLSearchParams();
  append(body, "mode", "payment");
  append(body, "success_url", `${origin}/#/order-success?session_id={CHECKOUT_SESSION_ID}`);
  append(body, "cancel_url", `${origin}/#/cart`);
  append(body, "billing_address_collection", "required");
  append(body, "customer_creation", "always");
  append(body, "phone_number_collection[enabled]", "true");
  append(body, "shipping_address_collection[allowed_countries][0]", "US");
  append(body, "allow_promotion_codes", "true");

  items.forEach((item, index) => {
    append(body, `line_items[${index}][quantity]`, String(item.qty));
    append(body, `line_items[${index}][price_data][currency]`, "usd");
    append(body, `line_items[${index}][price_data][unit_amount]`, String(item.cents));
    append(body, `line_items[${index}][price_data][product_data][name]`, item.name);
  });

  SHIPPING.forEach((rate, index) => {
    append(body, `shipping_options[${index}][shipping_rate_data][type]`, "fixed_amount");
    append(body, `shipping_options[${index}][shipping_rate_data][display_name]`, rate.name);
    append(body, `shipping_options[${index}][shipping_rate_data][fixed_amount][amount]`, String(rate.cents));
    append(body, `shipping_options[${index}][shipping_rate_data][fixed_amount][currency]`, "usd");
  });

  const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const data = await stripeRes.json();
  if (!stripeRes.ok || !data.url) {
    res.status(502).json({
      error: data.error?.message || `Stripe checkout failed (${stripeRes.status})`,
    });
    return;
  }
  res.status(200).json({ url: data.url });
}
