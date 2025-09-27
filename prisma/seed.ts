import { PrismaClient } from "@/generated/prisma";
import slugify from "slugify";

const prisma = new PrismaClient();

async function main() {
  // categories
  const catElect = await prisma.category.upsert({
    where: { slug: "electronics" },
    update: {},
    create: { name: "Electronics", slug: "electronics" },
  });

  const prods = [
    { name: "Wireless Headphones", sku: "WH-1000", price: 129.99, stock: 50 },
    { name: "Mechanical Keyboard", sku: "KB-67", price: 89.0, stock: 30 },
    { name: "USB-C Charger 65W", sku: "CH-65", price: 39.9, stock: 80 },
  ];

  for (const p of prods) {
    const product = await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: {
        name: p.name,
        slug: slugify(p.name, { lower: true, strict: true }),
        sku: p.sku,
        price: p.price as any,
        stock: p.stock,
        description: "Sample product for MVP.",
        images: {
          create: [
            { url: `https://picsum.photos/seed/${p.sku}/600/400`, sort: 0 },
          ],
        },
        categories: { create: [{ categoryId: catElect.id }] },
      },
    });
    console.log("Created:", product.name);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
