import { NextResponse } from "next/server";
import { z } from "zod";
import { authService } from "@/server/services/auth.service";
import { RegisterBody } from "@/server/schemas/auth";

const bodySchema = RegisterBody;

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parse = bodySchema.safeParse(json);
  if (!parse.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  try {
    const user = await authService.register(parse.data);
    return NextResponse.json(user);
  } catch (e: any) {
    if (String(e.message).includes("already")) {
      return NextResponse.json({ error: e.message }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
