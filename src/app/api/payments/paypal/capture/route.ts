import { NextResponse } from "next/server";
import { z } from "zod";
import { paymentService } from "@/server/services/payment.service";

const Body = z.object({ token: z.string().min(10) });

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parse = Body.safeParse(json);
  if (!parse.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { token } = parse.data;

  try {
    const updated = await paymentService.capturePaypal(token);
    return NextResponse.json({ ok: true, ...updated });
  } catch (e) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }
}
