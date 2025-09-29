"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddToCartButton({ productId, disabled = false }: { productId: number; disabled?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onAdd() {
    setLoading(true);
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, qty: 1 }),
      });
      router.push("/cart");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={onAdd}
      className="mt-6 px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50"
      disabled={disabled || loading}
    >
      {disabled ? "Out of stock" : loading ? "Adding..." : "Add to Cart"}
    </button>
  );
}