import { products, type Product } from "../data/products.ts";
import { resolveLines, type CartLine } from "./cart.ts";

export type StripeLine = {
  name: string;
  unitAmountCents: number;
  quantity: number;
};

export function stripeLines(
  lines: CartLine[],
  catalog: Product[] = products,
): StripeLine[] {
  return resolveLines(lines, catalog).map(({ product, qty }) => ({
    name: product.name,
    unitAmountCents: Math.round(product.price * 100),
    quantity: qty,
  }));
}
