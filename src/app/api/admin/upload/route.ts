import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/server/utils/session";
import prisma from "@/lib/prisma";
import path from "node:path";
import fs from "node:fs/promises";

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await req.formData();
  const file = form.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const orig = (file as any).name || "upload";
  const ext = path.extname(orig) || "";
  const safeExt = ext.toLowerCase().match(/^\.(png|jpg|jpeg|gif|webp|avif|svg)$/) ? ext : ".png";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${safeExt}`;
  const filepath = path.join(uploadsDir, filename);
  await fs.writeFile(filepath, bytes);

  const url = `/uploads/${filename}`;
  return NextResponse.json({ url }, { status: 201 });
}
