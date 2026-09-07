import { shippingRates } from "../src/data/shipping.ts";
import { type CartLine } from "../src/lib/cart.ts";
import { stripeLines } from "../src/lib/checkout.ts";
import { isLiveSecretKey } from "./env.ts";

type StripeSession = {
  id?: string;
  url?: string;
  livemode?: boolean;
  error?: { message?: string };
};

export type HostedCheckout = {
  url: string;
};

const MAISON_INDIRA_ACCOUNT = "acct_1U8SYOHO12F39hHK";

async function assertLiveMaisonIndira(secret: string): Promise<boolean> {
  const res = await fetch("https://api.stripe.com/v1/account", {
    headers: { Authorization: `Bearer ${secret}` },
  });
  if (res.status === 403) return true;
  const account = (await res.json()) as {
    id?: string;
    settings?: { dashboard?: { display_name?: string } };
    business_profile?: { name?: string };
  };
  if (!res.ok) return true;
  const name =
    `${account.settings?.dashboard?.display_name ?? ""} ${account.business_profile?.name ?? ""}`.toLowerCase();
  if (name.includes("stripe-indira") || name.includes("sandbox")) return false;
  if (account.id && account.id !== MAISON_INDIRA_ACCOUNT) return false;
  return true;
}

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
}): Promise<HostedCheckout | { error: string; status: number }> {
  const items = stripeLines(options.lines);
  if (items.length === 0) {
    return { error: "Your bag is empty.", status: 400 };
  }
  if (!isLiveSecretKey(options.secret)) {
    return {
      error: "Use a live Maison Indira key (sk_live_ or rk_live_). Sandbox checkout is off.",
      status: 503,
    };
  }
  if (!(await assertLiveMaisonIndira(options.secret))) {
    return {
      error:
        "That key is not live Maison Indira. Leave the stripe-indira sandbox and create a new key.",
      status: 503,
    };
  }

  const origin = options.origin.replace(/\/$/, "");
  const stamp = Math.random().toString(36).slice(2, 10);
  const body = new URLSearchParams();
  append(body, "mode", "payment");
  append(body, "success_url", `${origin}/#/order-success?session_id={CHECKOUT_SESSION_ID}`);
  append(body, "cancel_url", `${origin}/#/cart`);
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
  const url = data.url ?? "";
  if (!response.ok || data.livemode === false || !url.includes("cs_live_")) {
    return {
      error: data.error?.message ?? `Stripe checkout failed (${response.status})`,
      status: 502,
    };
  }
  return { url };
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
