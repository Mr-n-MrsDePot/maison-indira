import type { CartLine } from "./cart.ts";

/** Live Stripe Payment Links — themed Checkout, no API key on the website. */
export const stripeProductLinks: Record<string, string> = {
  "cloud-nine-oil": "https://buy.stripe.com/14A00jcEFduUcwI87VaVa00",
  "cloud-nine-diffuser": "https://buy.stripe.com/14A00jcEFbmMaoA3RFaVa04",
  "boutique-gift-set": "https://buy.stripe.com/dRm9AT7kl1Mc40c5ZNaVa03",
};

export const stripeShopLink = "https://buy.stripe.com/eVqcN5gUV2QgeEQ73RaVa02";

export function isLiveStripeCheckoutUrl(url: string): boolean {
  return url.startsWith("https://buy.stripe.com/") && !url.includes("/test_");
}

export function stripeCheckoutUrl(lines: CartLine[]): string {
  const active = lines.filter((line) => line.qty > 0);
  if (active.length === 1) {
    const base = stripeProductLinks[active[0].slug] ?? stripeShopLink;
    const qty = active[0].qty;
    if (qty > 1 && stripeProductLinks[active[0].slug]) {
      return `${base}?quantity=${qty}`;
    }
    return base;
  }
  return stripeShopLink;
}
