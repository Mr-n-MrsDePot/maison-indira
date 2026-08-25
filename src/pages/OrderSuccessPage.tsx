import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../CartContext.tsx";

export function OrderSuccessPage() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <main className="wrap empty">
      <p className="eyebrow">Paid</p>
      <h1>Thank you.</h1>
      <p>
        Stripe has the payment. A receipt goes to the email used at checkout. Maison Indira will
        pack and ship the order to the address you gave.
      </p>
      <Link className="btn" to="/shop">
        Back to the collection
      </Link>
    </main>
  );
}
