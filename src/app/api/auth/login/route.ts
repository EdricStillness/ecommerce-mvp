import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyPassword, signJwt } from "@/lib/auth";
import { z } from "zod";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parse = bodySchema.safeParse(json);
  if (!parse.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { email, password } = parse.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = await signJwt({ sub: String(user.id), email: user.email, role: user.role });
  const res = NextResponse.json({ ok: true });
  // Set HTTP-only cookie (7 days)
  res.headers.append(
    "Set-Cookie",
    `session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
  );
  return res;
}
