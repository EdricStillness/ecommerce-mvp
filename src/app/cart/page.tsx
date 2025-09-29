"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";

export default function CartPage() {
  const { items, set, update, remove, clear } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from server cookie
    fetch("/api/cart").then(async (r) => {
      const data = await r.json();
      set(data.items || []);
      setLoading(false);
    });
  }, [set]);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>
          Cart is empty. <Link className="underline" href="/">Go shopping</Link>
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((i) => (
            <div key={i.productId} className="flex items-center justify-between bg-white rounded-lg p-3 shadow">
              <div>
                <p>Product #{i.productId}</p>
                <p className="text-sm text-gray-600">Qty: {i.qty}</p>
              </div>
              <div className="space-x-2">
                <button className="px-2 py-1 border rounded" onClick={() => update({ productId: i.productId, qty: Math.max(1, i.qty - 1) })}>-</button>
                <button className="px-2 py-1 border rounded" onClick={() => update({ productId: i.productId, qty: i.qty + 1 })}>+</button>
                <button className="px-3 py-1 border rounded" onClick={() => remove(i.productId)}>Remove</button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <p>Total items: {totalItems}</p>
            <div className="space-x-3">
              <button className="px-4 py-2 rounded border" onClick={async () => { await fetch("/api/cart", { method: "DELETE" }); clear(); }}>Clear</button>
              <Link href="/checkout" className="px-4 py-2 rounded bg-black text-white">Checkout</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
