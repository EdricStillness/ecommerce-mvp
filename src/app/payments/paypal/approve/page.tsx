"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PayPalApprovePage() {
  const sp = useSearchParams();
  const router = useRouter();
  const token = sp.get("token");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    if (!token) {
      setError("Missing token");
      return;
    }
    setLoading(true);
    setError(null);
    // NOTE: Đây là giả lập. Các trường thẻ không được gửi tới bất kỳ PSP nào và không nên dùng ở production.
    const res = await fetch("/api/payments/paypal/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    setLoading(false);
    if (res.ok) router.push("/payments/success");
    else router.push("/payments/cancel");
  }

  function cancel() {
    router.push("/payments/cancel");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">PayPal</h1>
      <p className="text-sm text-gray-600 mb-4">This is a simulated payment step for demo purposes. Do not enter real card details.</p>
      {!token ? (
        <p className="text-red-600">Missing token.</p>
      ) : (
        <div className="max-w-sm space-y-3">
          <input className="w-full border rounded px-3 py-2" placeholder="Card number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
          <div className="flex gap-3">
            <input className="w-full border rounded px-3 py-2" placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
            <input className="w-full border rounded px-3 py-2" placeholder="CVC" value={cvc} onChange={(e) => setCvc(e.target.value)} />
          </div>
          <input className="w-full border rounded px-3 py-2" placeholder="Name on card" value={name} onChange={(e) => setName(e.target.value)} />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button onClick={pay} disabled={loading} className="px-4 py-2 rounded bg-black text-white disabled:opacity-50">
              {loading ? "Processing..." : "Pay Now"}
            </button>
            <button onClick={cancel} className="px-4 py-2 rounded border">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
