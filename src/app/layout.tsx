import "./globals.css";
import Link from "next/link";
import HeaderUser from "@/components/HeaderUser";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-dvh bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <nav className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-semibold">E-Commerce MVP</Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:underline">Store</Link>
              <Link href="/admin" className="hover:underline">Dashboard</Link>
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
