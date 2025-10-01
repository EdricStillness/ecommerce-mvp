"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PayPalApprovePage() {
  const sp = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("Processing...");

  useEffect(() => {
    const token = sp.get("token");
    if (!token) {
      setStatus("Missing token");
      return;
    }
    (async () => {
      const res = await fetch("/api/payments/paypal/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        setStatus("Payment captured. Redirecting...");
        setTimeout(() => router.push("/payments/success"), 800);
      } else {
        setStatus("Payment failed");
        setTimeout(() => router.push("/payments/cancel"), 1000);
      }
    })();
  }, [sp, router]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">PayPal Approval</h1>
      <p>{status}</p>
    </div>
  );
}
