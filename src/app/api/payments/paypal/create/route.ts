import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { paymentService } from "@/server/services/payment.service";

const Body = z.object({ orderId: z.number().int().positive() });

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parse = Body.safeParse(json);
  if (!parse.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { orderId } = parse.data;

  // Require session and ensure the order belongs to the current user
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let userId: number | null = null;
  try {
    const payload = await verifyJwt<{ sub: string }>(token);
    userId = Number(payload.sub);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = await prisma.order.findFirst({ where: { id: orderId, userId } });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.status === "PAID") return NextResponse.json({ error: "Order already paid" }, { status: 400 });

  const origin = req.headers.get("origin") || "http://localhost:3000";
  const { approvalUrl, token: approvalToken } = await paymentService.createPaypalApproval(order.id, String(order.totalAmount), origin);
  return NextResponse.json({ approvalUrl, token: approvalToken });
}
