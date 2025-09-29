import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";

// Cart structure in cookie: [{ productId, qty }]
const CartItem = z.object({ productId: z.number().int().positive(), qty: z.number().int().positive() });
const Cart = z.array(CartItem);

async function readCart() {
  const c = await cookies();
  const raw = c.get("cart")?.value || "[]";
  const parsed = Cart.safeParse(
    (() => {
      try {
        const arr = JSON.parse(raw);
        return Array.isArray(arr)
          ? arr.map((x: any) => ({ productId: Number(x.productId), qty: Number(x.qty) }))
          : [];
      } catch (_) {
        return [];
      }
    })()
  );
  return parsed.success ? parsed.data : [];
}

function writeCart(items: z.infer<typeof Cart>, body: any = { ok: true }) {
  const res = NextResponse.json(body);
  res.headers.append(
    "Set-Cookie",
    `cart=${encodeURIComponent(JSON.stringify(items))}; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`
  );
  return res;
}

export async function GET() {
  const items = await readCart();
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const items = await readCart();
  const json = await req.json().catch(() => null);
  const parse = CartItem.safeParse(json);
  if (!parse.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { productId, qty } = parse.data;
  const exist = items.find((i) => i.productId === productId);
  if (exist) exist.qty += qty; else items.push({ productId, qty });
  return writeCart(items);
}

export async function PATCH(req: Request) {
  const items = await readCart();
  const json = await req.json().catch(() => null);
  const parse = CartItem.safeParse(json);
  if (!parse.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { productId, qty } = parse.data;
  const next = items.map((i) => (i.productId === productId ? { ...i, qty } : i)).filter((i) => i.qty > 0);
  return writeCart(next);
}

export async function DELETE(req: Request) {
  const items = await readCart();
  const { searchParams } = new URL(req.url);
  const idParam = searchParams.get("productId");
  if (!idParam) {
    // clear all
    return writeCart([], { ok: true, cleared: true });
  }
  const id = Number(idParam);
  const next = items.filter((i) => i.productId !== id);
  return writeCart(next);
}
