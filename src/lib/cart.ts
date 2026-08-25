import { checkoutUrl, products, type Product } from "../data/products.ts";

export type CartLine = {
  slug: string;
  qty: number;
};

export const CART_STORAGE_KEY = "maison-indira-cart";

export function addLine(lines: CartLine[], slug: string, qty = 1): CartLine[] {
  if (qty <= 0) return lines;
  const existing = lines.find((line) => line.slug === slug);
  if (existing) {
    return lines.map((line) =>
      line.slug === slug ? { ...line, qty: line.qty + qty } : line,
    );
  }
  return [...lines, { slug, qty }];
}

export function setLineQty(lines: CartLine[], slug: string, qty: number): CartLine[] {
  if (qty <= 0) return lines.filter((line) => line.slug !== slug);
  if (lines.some((line) => line.slug === slug)) {
    return lines.map((line) => (line.slug === slug ? { ...line, qty } : line));
  }
  return [...lines, { slug, qty }];
}

export function removeLine(lines: CartLine[], slug: string): CartLine[] {
  return lines.filter((line) => line.slug !== slug);
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.qty, 0);
}

export function resolveLines(
  lines: CartLine[],
  catalog: Product[] = products,
): { product: Product; qty: number }[] {
  return lines.flatMap((line) => {
    const product = catalog.find((item) => item.slug === line.slug);
    return product ? [{ product, qty: line.qty }] : [];
  });
}

export function cartTotal(lines: CartLine[], catalog: Product[] = products): number {
  return resolveLines(lines, catalog).reduce(
    (sum, line) => sum + line.product.price * line.qty,
    0,
  );
}

export function shopifyCheckout(
  lines: CartLine[],
  catalog: Product[] = products,
  store?: string,
): string {
  const resolved = resolveLines(lines, catalog).map((line) => ({
    variantId: line.product.variantId,
    qty: line.qty,
  }));
  return checkoutUrl(resolved, store);
}

export function loadCart(): CartLine[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartLine =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as CartLine).slug === "string" &&
        typeof (item as CartLine).qty === "number" &&
        (item as CartLine).qty > 0,
    );
  } catch {
    return [];
  }
}

export function saveCart(lines: CartLine[]): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
}
