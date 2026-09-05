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
  type CartLine,
} from "./lib/cart.ts";
import { stripeCheckoutUrl } from "./lib/stripeLinks.ts";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  total: number;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  checkout: () => Promise<void>;
  checkoutBusy: boolean;
  checkoutError: string | null;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => loadCart());
  const [open, setOpen] = useState(false);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    saveCart(lines);
  }, [lines]);

  const add = useCallback((slug: string, qty = 1) => {
    setLines((current) => addLine(current, slug, qty));
    setOpen(true);
    setCheckoutError(null);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setLines((current) => setLineQty(current, slug, qty));
  }, []);

  const remove = useCallback((slug: string) => {
    setLines((current) => removeLine(current, slug));
  }, []);

  const clear = useCallback(() => {
    setLines([]);
  }, []);

  const checkout = useCallback(async () => {
    setCheckoutBusy(true);
    setCheckoutError(null);
    // Live Payment Links on Maison Indira only — never the unclaimed stripe-indira sandbox.
    window.location.assign(stripeCheckoutUrl(lines));
    setCheckoutBusy(false);
  }, [lines]);

  const value = useMemo(
    () => ({
      lines,
      count: cartCount(lines),
      total: cartTotal(lines),
      add,
      setQty,
      remove,
      clear,
      checkout,
      checkoutBusy,
      checkoutError,
      open,
      setOpen,
    }),
    [
      add,
      checkout,
      checkoutBusy,
      checkoutError,
      clear,
      lines,
      open,
      remove,
      setQty,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
