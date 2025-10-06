import { z } from "zod";

export const AdminCreateProductSchema = z.object({
  name: z.string().min(2),
  sku: z.string().min(2),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  description: z.string().optional(),
  images: z.array(z.object({ url: z.string().url(), sort: z.number().int().min(0).optional() })).min(1),
});

export type TAdminCreateProduct = z.infer<typeof AdminCreateProductSchema>;
