import { z } from "zod";

export const CartItem = z.object({ productId: z.number().int().positive(), qty: z.number().int().positive() });
export const Cart = z.array(CartItem);
export type TCartItem = z.infer<typeof CartItem>;
export type TCart = z.infer<typeof Cart>;
