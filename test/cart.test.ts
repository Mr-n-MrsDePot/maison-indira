import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatMoney } from "../src/data/products.ts";
import { shippingRates } from "../src/data/shipping.ts";
import {
  addLine,
  cartCount,
  cartTotal,
  removeLine,
  setLineQty,
} from "../src/lib/cart.ts";
import { stripeLines } from "../src/lib/checkout.ts";
import { parseCartBody } from "../server/stripe.ts";
import { HOUSE_CODE, tryHouseCode } from "../src/lib/house.ts";
import { isLiveSecretKey } from "../server/env.ts";
import { isLiveStripeCheckoutUrl, stripeCheckoutUrl } from "../src/lib/stripeLinks.ts";

describe("cart", () => {
  it("adds a new line and increments an existing one", () => {
    const first = addLine([], "cloud-nine-oil", 1);
    const second = addLine(first, "cloud-nine-oil", 2);
    assert.deepEqual(second, [{ slug: "cloud-nine-oil", qty: 3 }]);
  });

  it("removes a line when quantity is zero", () => {
    const lines = setLineQty([{ slug: "gift", qty: 1 }], "gift", 0);
    assert.deepEqual(lines, []);
  });

  it("counts and totals known products", () => {
    const lines = [
      { slug: "cloud-nine-oil", qty: 2 },
      { slug: "boutique-gift-set", qty: 1 },
    ];
    assert.equal(cartCount(lines), 3);
    assert.equal(cartTotal(lines), 55);
  });

  it("drops unknown slugs from the total", () => {
    assert.equal(cartTotal([{ slug: "missing", qty: 4 }]), 0);
    assert.equal(cartCount([{ slug: "missing", qty: 4 }]), 0);
  });

  it("rejects non-finite quantities", () => {
    const lines = addLine([], "cloud-nine-oil", Number.POSITIVE_INFINITY);
    assert.deepEqual(lines, []);
  });

  it("removes a line by slug", () => {
    const lines = removeLine(
      [
        { slug: "a", qty: 1 },
        { slug: "b", qty: 2 },
      ],
      "a",
    );
    assert.deepEqual(lines, [{ slug: "b", qty: 2 }]);
  });
});

describe("stripe checkout payload", () => {
  it("prices from the catalog, not the client", () => {
    const items = stripeLines([
      { slug: "cloud-nine-oil", qty: 2 },
      { slug: "cloud-nine-diffuser", qty: 1 },
    ]);
    assert.deepEqual(items, [
      { name: "Cloud Nine Home Fragrance Oil", unitAmountCents: 1500, quantity: 2 },
      { name: "Cloud Nine Modern Reed Diffuser", unitAmountCents: 4000, quantity: 1 },
    ]);
  });

  it("ignores unknown slugs and empty carts", () => {
    assert.deepEqual(stripeLines([{ slug: "nope", qty: 3 }]), []);
    assert.deepEqual(parseCartBody({ lines: [{ slug: "cloud-nine-oil", qty: 1.9 }] }), [
      { slug: "cloud-nine-oil", qty: 1 },
    ]);
    assert.deepEqual(parseCartBody({ lines: "bad" }), []);
  });

  it("uses a live Payment Link when the API is offline", () => {
    const oil = stripeCheckoutUrl([{ slug: "cloud-nine-oil", qty: 1 }]);
    const mixed = stripeCheckoutUrl([
      { slug: "cloud-nine-oil", qty: 1 },
      { slug: "boutique-gift-set", qty: 1 },
    ]);
    assert.equal(isLiveStripeCheckoutUrl(oil), true);
    assert.equal(isLiveStripeCheckoutUrl(mixed), true);
    assert.notEqual(oil, mixed);
    const twoOils = stripeCheckoutUrl([{ slug: "cloud-nine-oil", qty: 2 }]);
    assert.match(twoOils, /quantity=2/);
  });

  it("ships at the house rates", () => {
    assert.equal(shippingRates[0]?.amountCents, 695);
    assert.equal(shippingRates[1]?.amountCents, 1295);
  });
});

describe("stripe keys", () => {
  it("accepts live secret and restricted keys only", () => {
    assert.equal(isLiveSecretKey("sk_live_example"), true);
    assert.equal(isLiveSecretKey("rk_live_example"), true);
    assert.equal(isLiveSecretKey("sk_test_example"), false);
    assert.equal(isLiveSecretKey("rk_test_example"), false);
    assert.equal(isLiveSecretKey("pk_live_example"), false);
  });
});

describe("house unlock", () => {
  it("accepts the shop phone last four", () => {
    assert.equal(HOUSE_CODE.length, 4);
    assert.equal(tryHouseCode("0000"), false);
  });
});

describe("money", () => {
  it("formats USD", () => {
    assert.equal(formatMoney(15), "$15.00");
    assert.equal(formatMoney(40), "$40.00");
  });
});
