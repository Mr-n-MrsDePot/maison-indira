import type { CartLine } from "./cart.ts";

/** Live Stripe Payment Links — themed Checkout, no secret key required. */
export const stripeProductLinks: Record<string, string> = {
  "cloud-nine-oil": "https://buy.stripe.com/14A00jcEFduUcwI87VaVa00",
  "cloud-nine-diffuser": "https://buy.stripe.com/14A00jcEFbmMaoA3RFaVa04",
  "boutique-gift-set": "https://buy.stripe.com/dRm9AT7kl1Mc40c5ZNaVa03",
};

export const stripeShopLink = "https://buy.stripe.com/eVqcN5gUV2QgeEQ73RaVa02";

export function stripeCheckoutUrl(lines: CartLine[]): string {
  const active = lines.filter((line) => line.qty > 0);
  if (active.length === 1) {
    return stripeProductLinks[active[0].slug] ?? stripeShopLink;
  }
  return stripeShopLink;
}
