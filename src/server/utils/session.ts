import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";

export async function getSessionUserId(): Promise<number | null> {
  const c = await cookies();
  const token = c.get("session")?.value;
  if (!token) return null;
  try {
    const payload = await verifyJwt<{ sub: string }>(token);
    const userId = Number(payload.sub);
    return Number.isFinite(userId) ? userId : null;
  } catch {
    return null;
  }
}
