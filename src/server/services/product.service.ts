import { prisma } from "@/lib/prisma";

export const productService = {
  list: () =>
    prisma.product.findMany({
      include: { images: { orderBy: { sort: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  bySlug: (slug: string) =>
    prisma.product.findUnique({ where: { slug }, include: { images: { orderBy: { sort: "asc" } } } }),
};
