import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addLine,
  cartCount,
  cartTotal,
  loadCart,
  removeLine,
  saveCart,
  setLineQty,
  shopifyCheckout,
  type CartLine,
} from "./lib/cart.ts";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  total: number;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  checkout: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => loadCart());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    saveCart(lines);
  }, [lines]);

  const add = useCallback((slug: string, qty = 1) => {
    setLines((current) => addLine(current, slug, qty));
    setOpen(true);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setLines((current) => setLineQty(current, slug, qty));
  }, []);

  const remove = useCallback((slug: string) => {
    setLines((current) => removeLine(current, slug));
  }, []);

  const checkout = useCallback(() => {
    const url = shopifyCheckout(lines);
    window.location.assign(url);
  }, [lines]);

  const value = useMemo(
    () => ({
      lines,
      count: cartCount(lines),
      total: cartTotal(lines),
      add,
      setQty,
      remove,
      checkout,
      open,
      setOpen,
    }),
    [add, checkout, lines, open, remove, setQty],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
