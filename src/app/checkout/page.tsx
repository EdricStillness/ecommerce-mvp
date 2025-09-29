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
    setPlacing(false);
    if (res.ok) {
      clear();
      router.push("/");
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
