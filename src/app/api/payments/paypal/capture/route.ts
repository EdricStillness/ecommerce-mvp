import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyJwt } from "@/lib/auth";

const Body = z.object({ token: z.string().min(10) });

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parse = Body.safeParse(json);
  if (!parse.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { token } = parse.data;

  try {
    const payload = await verifyJwt<{ kind: string; orderId: number; amount: string }>(token);
    if (payload.kind !== "paypal") throw new Error("Invalid token kind");
    const orderId = Number(payload.orderId);
    if (!Number.isFinite(orderId)) throw new Error("Invalid orderId");

    const updated = await prisma.order.update({ where: { id: orderId }, data: { status: "PAID" } });
    return NextResponse.json({ ok: true, orderId: updated.id, status: updated.status });
  } catch (e) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }
}
