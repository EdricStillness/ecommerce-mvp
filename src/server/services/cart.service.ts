import { z } from "zod";
import { Cart, CartItem, TCart, TCartItem } from "../schemas/cart";

export const cartService = {
  parse(raw: string | undefined): TCart {
    const parsed = Cart.safeParse(
      (() => {
        try {
          const arr = raw ? JSON.parse(raw) : [];
          return Array.isArray(arr)
            ? arr.map((x: any) => ({ productId: Number(x.productId), qty: Number(x.qty) }))
            : [];
        } catch (_) {
          return [];
        }
      })()
    );
    return parsed.success ? parsed.data : [];
  },
  add(items: TCart, item: TCartItem): TCart {
    const exist = items.find((i) => i.productId === item.productId);
    if (exist) exist.qty += item.qty; else items.push({ ...item });
    return items;
  },
  set(items: TCart, item: TCartItem): TCart {
    return items.map((i) => (i.productId === item.productId ? { ...i, qty: item.qty } : i)).filter((i) => i.qty > 0);
  },
  remove(items: TCart, productId: number): TCart {
    return items.filter((i) => i.productId !== productId);
  },
  serialize(items: TCart): string {
    return encodeURIComponent(JSON.stringify(items));
  },
};
