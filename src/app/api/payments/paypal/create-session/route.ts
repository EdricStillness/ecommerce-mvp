import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUserId } from "@/server/utils/session";
import { paymentService } from "@/server/services/payment.service";

const Body = z.object({ items: z.array(z.object({ productId: z.number().int().positive(), qty: z.number().int().positive() })) });

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parse = Body.safeParse(json);
  if (!parse.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const origin = req.headers.get("origin") || "http://localhost:3000";
  const { approvalUrl, token } = await paymentService.createPaypalSessionFromCart(userId, parse.data.items, origin);
  return NextResponse.json({ approvalUrl, token });
}
