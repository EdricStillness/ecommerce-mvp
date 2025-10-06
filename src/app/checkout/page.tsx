"use client";

import { useCart } from "@/store/cart";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const router = useRouter();
  const [placing, setPlacing] = useState(false);
  const [summary, setSummary] = useState<{ items: { productId: number; name: string; qty: number; price: number; lineTotal: number }[]; total: number } | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/checkout/summary", { cache: "no-store" });
      if (res.ok) setSummary(await res.json());
    })();
  }, [items]);

  async function placeOrder() {
    setPlacing(true);
    // New flow: create PayPal session directly from cart items
    const createRes = await fetch("/api/payments/paypal/create-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    setPlacing(false);
    if (createRes.ok) {
      const { approvalUrl } = await createRes.json();
      // Cart sẽ được trừ khi capture tạo order thành công
      router.push(approvalUrl);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      {summary ? (
        <div className="bg-white rounded p-3 shadow text-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Product</th>
                <th className="py-2">Qty</th>
                <th className="py-2">Price</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {summary.items.map((it) => (
                <tr key={it.productId} className="border-b last:border-0">
                  <td className="py-2">{it.name}</td>
                  <td className="py-2">{it.qty}</td>
                  <td className="py-2">${" "}{it.price.toFixed(2)}</td>
                  <td className="py-2 text-right">${" "}{it.lineTotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="py-2 font-semibold text-right">Grand Total</td>
                <td className="py-2 text-right font-semibold">${" "}{summary.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <pre className="bg-white rounded p-3 shadow text-sm">{JSON.stringify(items, null, 2)}</pre>
      )}
      <button disabled={placing} className="mt-4 px-4 py-2 rounded bg-black text-white disabled:opacity-50" onClick={placeOrder}>
        {placing ? "Redirecting to PayPal..." : "Pay with PayPal"}
      </button>
    </div>
  );
}
