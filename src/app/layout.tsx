import "./globals.css";
import Link from "next/link";
import HeaderUser from "@/components/HeaderUser";
import prisma from "@/lib/prisma";
import { getSessionUserId } from "@/server/utils/session";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const uid = await getSessionUserId();
  const user = uid ? await prisma.user.findUnique({ where: { id: uid } }) : null;
  const isAdmin = user?.role === "ADMIN";
  return (
    <html lang="vi">
      <body className="min-h-dvh bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <nav className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-semibold">E-Commerce MVP</Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:underline">Store</Link>
              {isAdmin ? (<Link href="/admin" className="hover:underline">Dashboard</Link>) : null}
              {/* Auth state */}
              <HeaderUser />
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
