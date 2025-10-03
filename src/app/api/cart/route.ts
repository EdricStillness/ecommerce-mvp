import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { cartService } from "@/server/services/cart.service";
import { CartItem } from "@/server/schemas/cart";

export async function GET() {
  const c = await cookies();
  const items = cartService.parse(c.get("cart")?.value);
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const c = await cookies();
  const items = cartService.parse(c.get("cart")?.value);
  const json = await req.json().catch(() => null);
  const parse = CartItem.safeParse(json);
  if (!parse.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { productId, qty } = parse.data;
  const next = cartService.add(items, { productId, qty });
  const res = NextResponse.json({ ok: true });
  res.headers.append("Set-Cookie", `cart=${cartService.serialize(next)}; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`);
  return res;
}

export async function PATCH(req: Request) {
  const c = await cookies();
  const items = cartService.parse(c.get("cart")?.value);
  const json = await req.json().catch(() => null);
  const parse = CartItem.safeParse(json);
  if (!parse.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { productId, qty } = parse.data;
  const next = cartService.set(items, { productId, qty });
  const res = NextResponse.json({ ok: true });
  res.headers.append("Set-Cookie", `cart=${cartService.serialize(next)}; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`);
  return res;
}

export async function DELETE(req: Request) {
  const c = await cookies();
  const items = cartService.parse(c.get("cart")?.value);
  const { searchParams } = new URL(req.url);
  const idParam = searchParams.get("productId");
  if (!idParam) {
    // clear all
    const res = NextResponse.json({ ok: true, cleared: true });
    res.headers.append("Set-Cookie", `cart=[]; Path=/; SameSite=Lax; Max-Age=0`);
    return res;
  }
  const id = Number(idParam);
  const next = cartService.remove(items, id);
  const res = NextResponse.json({ ok: true });
  res.headers.append("Set-Cookie", `cart=${cartService.serialize(next)}; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`);
  return res;
}
