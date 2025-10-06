import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/server/utils/session";
import prisma from "@/lib/prisma";
import { AdminCreateProductSchema } from "@/server/schemas/product";
import { productService } from "@/server/services/product.service";

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = AdminCreateProductSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const created = await productService.create(parsed.data);
  return NextResponse.json(created, { status: 201 });
}
