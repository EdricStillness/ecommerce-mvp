import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { orderService } from "@/server/services/order.service";
import { getSessionUserId } from "@/server/utils/session";
import { CheckoutBody } from "@/server/schemas/order";

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parse = CheckoutBody.safeParse(json);
  if (!parse.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { items } = parse.data;
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { orderId, totalAmount } = await orderService.createOrder(userId, { items });
  const cookieStore = await cookies();
  const res = NextResponse.json({ orderId, totalAmount });
  // Clear cart cookie
  res.headers.append("Set-Cookie", `cart=[]; Path=/; SameSite=Lax; Max-Age=0`);
  return res;
}
