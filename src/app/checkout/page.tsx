"use client";

import { useCart } from "@/store/cart";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const router = useRouter();
  const [placing, setPlacing] = useState(false);

  async function placeOrder() {
    setPlacing(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) {
      setPlacing(false);
      return;
    }
    const data = await res.json();
    const orderId = data.orderId as number;

    // Call simulated PayPal create to get approval URL
    const createRes = await fetch("/api/payments/paypal/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    setPlacing(false);
    if (createRes.ok) {
      const { approvalUrl } = await createRes.json();
      // Clear local cart client state; server already clears cookie on checkout
      clear();
      router.push(approvalUrl);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <pre className="bg-white rounded p-3 shadow text-sm">{JSON.stringify(items, null, 2)}</pre>
      <button disabled={placing} className="mt-4 px-4 py-2 rounded bg-black text-white disabled:opacity-50" onClick={placeOrder}>
        {placing ? "Placing..." : "Place Order"}
      </button>
    </div>
  );
}
