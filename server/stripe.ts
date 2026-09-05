import { shippingRates } from "../src/data/shipping.ts";
import { type CartLine } from "../src/lib/cart.ts";
import { stripeLines } from "../src/lib/checkout.ts";

type StripeSession = {
  id?: string;
  url?: string;
  client_secret?: string;
  error?: { message?: string };
};

export type EmbeddedCheckout = {
  clientSecret: string;
  publishableKey: string;
};

function append(body: URLSearchParams, key: string, value: string): void {
  body.append(key, value);
}

export function parseCartBody(raw: unknown): CartLine[] {
  if (typeof raw !== "object" || raw === null) return [];
  const lines = (raw as { lines?: unknown }).lines;
  if (!Array.isArray(lines)) return [];
  return lines.flatMap((item) => {
    if (typeof item !== "object" || item === null) return [];
    const slug = (item as CartLine).slug;
    const qty = Math.min(99, Math.max(0, Math.floor(Number((item as CartLine).qty))));
    if (typeof slug !== "string" || slug.length === 0 || qty <= 0) return [];
    return [{ slug, qty }];
  });
}

export async function createCheckoutSession(options: {
  secret: string;
  publishableKey: string;
  origin: string;
  lines: CartLine[];
}): Promise<EmbeddedCheckout | { error: string; status: number }> {
  const items = stripeLines(options.lines);
  if (items.length === 0) {
    return { error: "Your bag is empty.", status: 400 };
  }
  if (!options.secret.startsWith("sk_live_")) {
    return {
      error: "Use a live Maison Indira key (sk_live_...). Sandbox checkout is off.",
      status: 503,
    };
  }
  if (!options.publishableKey.startsWith("pk_live_")) {
    return {
      error: "Add STRIPE_PUBLISHABLE_KEY (pk_live_...) so pay stays on the site.",
      status: 503,
    };
  }

  const origin = options.origin.replace(/\/$/, "");
  const stamp = Math.random().toString(36).slice(2, 10);
  const body = new URLSearchParams();
  append(body, "mode", "payment");
  append(body, "ui_mode", "embedded");
  append(body, "return_url", `${origin}/#/order-success?session_id={CHECKOUT_SESSION_ID}`);
  append(body, "integration_identifier", `maison-indira-${stamp}`);
  append(body, "billing_address_collection", "required");
  append(body, "customer_creation", "always");
  append(body, "phone_number_collection[enabled]", "true");
  append(body, "shipping_address_collection[allowed_countries][0]", "US");
  append(body, "allow_promotion_codes", "true");
  append(body, "name_collection[individual][enabled]", "true");
  append(body, "custom_text[submit][message]", "Pay Maison Indira");
  append(body, "custom_text[shipping_address][message]", "Where should Cloud Nine arrive?");
  append(body, "custom_text[after_submit][message]", "Not just fragrance. An experience.");

  items.forEach((item, index) => {
    append(body, `line_items[${index}][quantity]`, String(item.quantity));
    append(body, `line_items[${index}][price_data][currency]`, "usd");
    append(body, `line_items[${index}][price_data][unit_amount]`, String(item.unitAmountCents));
    append(body, `line_items[${index}][price_data][product_data][name]`, item.name);
  });

  shippingRates.forEach((rate, index) => {
    append(body, `shipping_options[${index}][shipping_rate_data][type]`, "fixed_amount");
    append(
      body,
      `shipping_options[${index}][shipping_rate_data][display_name]`,
      rate.name,
    );
    append(
      body,
      `shipping_options[${index}][shipping_rate_data][fixed_amount][amount]`,
      String(rate.amountCents),
    );
    append(
      body,
      `shipping_options[${index}][shipping_rate_data][fixed_amount][currency]`,
      "usd",
    );
  });

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const data = (await response.json()) as StripeSession;
  if (!response.ok || !data.client_secret) {
    return {
      error: data.error?.message ?? `Stripe checkout failed (${response.status})`,
      status: 502,
    };
  }
  return { clientSecret: data.client_secret, publishableKey: options.publishableKey };
}

export function requestOrigin(headers: Headers | Record<string, string | undefined>): string {
  const fromEnv = process.env.SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  const get = (key: string): string | undefined => {
    if (headers instanceof Headers) return headers.get(key) ?? undefined;
    return headers[key] ?? headers[key.toLowerCase()];
  };
  const proto = get("x-forwarded-proto") ?? "http";
  const host = get("x-forwarded-host") ?? get("host") ?? "localhost:5222";
  return `${proto}://${host}`;
}
