import { z } from "zod";

export const CheckoutBody = z.object({ items: z.array(z.object({ productId: z.number().int().positive(), qty: z.number().int().positive() })) });
export type TCheckoutBody = z.infer<typeof CheckoutBody>;
