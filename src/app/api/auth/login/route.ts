import { NextResponse } from "next/server";
import { z } from "zod";
import { authService } from "@/server/services/auth.service";
import { LoginBody } from "@/server/schemas/auth";

const bodySchema = LoginBody;

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parse = bodySchema.safeParse(json);
  if (!parse.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { token } = await authService.login(parse.data).catch(() => ({ token: null as any }));
  if (!token) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  // Set HTTP-only cookie (7 days)
  res.headers.append(
    "Set-Cookie",
    `session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
  );
  return res;
}
