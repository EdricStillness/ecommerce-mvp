import { prisma } from "@/lib/prisma";
import slugify from "slugify";
import { TAdminCreateProduct } from "../schemas/product";

export const productService = {
  list: () =>
    prisma.product.findMany({
      include: { images: { orderBy: { sort: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  bySlug: (slug: string) =>
    prisma.product.findUnique({ where: { slug }, include: { images: { orderBy: { sort: "asc" } } } }),
  byIds: (ids: number[]) =>
    prisma.product.findMany({
      where: { id: { in: ids } },
      include: { images: { orderBy: { sort: "asc" }, take: 1 } },
    }),
  create: async (input: TAdminCreateProduct) => {
    const slug = slugify(input.name, { lower: true, strict: true });
    const p = await prisma.product.create({
      data: {
        name: input.name,
        slug,
        sku: input.sku,
        price: input.price as any,
        stock: input.stock,
        description: input.description,
        images: { create: input.images.map((im, i) => ({ url: im.url, sort: im.sort ?? i })) },
      },
      include: { images: { orderBy: { sort: "asc" } } },
    });
    return p;
  },
};
