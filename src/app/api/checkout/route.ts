import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { z } from "zod";

const Body = z.object({ items: z.array(z.object({ productId: z.number().int().positive(), qty: z.number().int().positive() })) });

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parse = Body.safeParse(json);
  if (!parse.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { items } = parse.data;

  // Auth: extract user from session cookie (JWT)
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let userId: number | null = null;
  try {
    const payload = await verifyJwt<{ sub: string }>(token);
    userId = Number(payload.sub);
    if (!Number.isFinite(userId)) throw new Error("Invalid sub");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Load products and compute total
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  if (products.length !== productIds.length) return NextResponse.json({ error: "Some products not found" }, { status: 400 });

  const totalAmount = products.reduce((sum, p) => {
    const qty = items.find((i) => i.productId === p.id)?.qty || 0;
    return sum + Number(p.price) * qty;
  }, 0);

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId: userId!,
        totalAmount: totalAmount as any,
        status: "PENDING",
      },
    });

    await tx.orderItem.createMany({
      data: items.map((i) => ({
        orderId: created.id,
        productId: i.productId,
        price: products.find((p) => p.id === i.productId)!.price as any,
        qty: i.qty,
      })),
    });

    // Decrease stock
    for (const i of items) {
      await tx.product.update({ where: { id: i.productId }, data: { stock: { decrement: i.qty } } });
    }

    return created;
  });

  const res = NextResponse.json({ orderId: order.id, totalAmount });
  // Clear cart cookie
  res.headers.append("Set-Cookie", `cart=[]; Path=/; SameSite=Lax; Max-Age=0`);
  return res;
}
