import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { z } from "zod";

const bodySchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parse = bodySchema.safeParse(json);
  if (!parse.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { name, email, password } = parse.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({ data: { name, email, passwordHash } });
  return NextResponse.json({ id: user.id, email: user.email, name: user.name });
}
