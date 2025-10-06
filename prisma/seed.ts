import { PrismaClient, Role } from "@/generated/prisma";
import slugify from "slugify";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // admin user
  const adminEmail = "admin@example.com";
  const adminPassword = "admin123";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: Role.ADMIN },
    create: {
      email: adminEmail,
      name: "Admin",
      passwordHash,
      role: Role.ADMIN,
    },
  });
  console.log(`Admin ready: ${adminEmail}`);

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
    { name: "4K Monitor 27\"", sku: "MN-27-4K", price: 299.0, stock: 20 },
    { name: "Gaming Mouse", sku: "GM-220", price: 49.9, stock: 60 },
    { name: "Bluetooth Speaker", sku: "BS-12", price: 59.9, stock: 40 },
    { name: "Portable SSD 1TB", sku: "SSD-1TB", price: 109.0, stock: 25 },
    { name: "Webcam 1080p", sku: "WC-1080", price: 39.0, stock: 70 },
    { name: "USB-C Hub 8-in-1", sku: "HUB-8", price: 69.0, stock: 35 },
    { name: "Noise Cancelling Earbuds", sku: "NC-EB-10", price: 79.0, stock: 45 },
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
        images: { create: [{ url: `https://picsum.photos/seed/${p.sku}/600/400`, sort: 0 }] },
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
