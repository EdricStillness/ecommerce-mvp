import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { cartService } from "@/server/services/cart.service";
import { productService } from "@/server/services/product.service";

export async function GET() {
  const c = await cookies();
  const items = cartService.parse(c.get("cart")?.value);
  if (items.length === 0) return NextResponse.json({ items: [], total: 0 });
  const ids = items.map((i) => i.productId);
  const products = await productService.byIds(ids);
  const enriched = items.map((i) => {
    const p = products.find((x) => x.id === i.productId)!;
    const price = Number(p.price);
    return { productId: i.productId, name: p.name, qty: i.qty, price, lineTotal: price * i.qty };
  });
  const total = enriched.reduce((s, x) => s + x.lineTotal, 0);
  return NextResponse.json({ items: enriched, total });
}
