import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.text().catch(() => "");
  // In real integration, verify payload signature here (VNPay/PayPal)
  console.log("[payments:webhook] received:", body.slice(0, 500));
  return NextResponse.json({ ok: true });
}
