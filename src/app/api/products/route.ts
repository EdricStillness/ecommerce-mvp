import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await prisma.product.findMany({
    include: { images: { orderBy: { sort: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ products });
}
