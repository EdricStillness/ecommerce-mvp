import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";

export default async function HeaderUser() {
  const c = await cookies();
  const token = c.get("session")?.value;
  let email: string | null = null;
  if (token) {
    try {
      const payload = await verifyJwt<{ email: string }>(token);
      email = payload.email;
    } catch {}
  }
  if (!email) {
    return (
      <div className="space-x-4 text-sm">
        <Link href="/sign-in" className="hover:underline">Sign In</Link>
        <Link href="/sign-up" className="hover:underline">Sign Up</Link>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 text-sm">
  <Link href="/orders" className="hover:underline">Orders</Link>
      <span className="text-gray-600">{email}</span>
      <LogoutButton />
    </div>
  );
}
