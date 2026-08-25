import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { checkoutUrl, formatMoney } from "../src/data/products.ts";
import {
  addLine,
  cartCount,
  cartTotal,
  removeLine,
  setLineQty,
  shopifyCheckout,
} from "../src/lib/cart.ts";

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

  it("builds a Shopify cart permalink", () => {
    const url = shopifyCheckout([
      { slug: "cloud-nine-oil", qty: 2 },
      { slug: "cloud-nine-diffuser", qty: 1 },
    ]);
    assert.equal(
      url,
      "https://maisonindira.myshopify.com/cart/49432918884594:2,49473794703602:1",
    );
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

describe("money", () => {
  it("formats USD", () => {
    assert.equal(formatMoney(15), "$15.00");
    assert.equal(formatMoney(40), "$40.00");
  });

  it("returns an empty Shopify cart when there are no lines", () => {
    assert.equal(checkoutUrl([]), "https://maisonindira.myshopify.com/cart");
  });
});
